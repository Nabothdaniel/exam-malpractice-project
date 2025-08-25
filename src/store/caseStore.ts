import { create } from "zustand";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { generateCaseId } from "../utils/helperFunctions";
import { emailService } from "../services/emailService";
import type { Case, CaseUpdate, NewCase, CaseStore,CaseType } from "@/types";
import { uploadToCloudinary } from "../utils/cloudinary"; 

const mapDocToCase = (docSnap: QueryDocumentSnapshot): Case => {
  const data = docSnap.data() as Omit<Case, "id">;
  return { id: docSnap.id, ...data };
};

const mapDocToCaseType = (docSnap: QueryDocumentSnapshot): CaseType => {
  const data = docSnap.data() as Omit<CaseType, "id">;
  return { id: docSnap.id, ...data };
};

let unsubscribeCases: (() => void) | null = null;
  let unsubscribeCaseTypes: (() => void) | null = null

export const useCaseStore = create<CaseStore>((set, get) => ({
  
  caseTypes: [],
  cases: [],
  recentCases: [],
  recentUpdates: [],
  selectedCase: null,
  isCreateCaseModalOpen: false,
  loading: false,

    // Fetch caseTypes from Firebase
    fetchCaseTypes: async () => {
      try {
        if (unsubscribeCaseTypes) unsubscribeCaseTypes();

        const q = query(collection(db, "caseTypes"), orderBy("title"));
        unsubscribeCaseTypes = onSnapshot(q, (snapshot) => {
          const fetchedCaseTypes: CaseType[] = snapshot.docs.map(mapDocToCaseType);
          set({ caseTypes: fetchedCaseTypes });
        });
      } catch (error) {
        console.error("Error fetching caseTypes:", error);
      }
    },


  addCaseType: async (newType: Partial<CaseType>) => {
    try {
      if (!newType.title || !newType.scope || !newType.description) return;

      const id = `caseType_${Date.now()}`; 
      const caseTypeObj: CaseType = {
        id,
        title: newType.title,
        scope: newType.scope,
        description: newType.description,
        status: newType.status || "active",
        count: 0,
        color:
          newType.status === "active"
            ? "bg-green-100 text-green-700 border-green-200"
            : "bg-gray-100 text-gray-700 border-gray-200",
      };

      // Add to Firebase
      await addDoc(collection(db, "caseTypes"), caseTypeObj);

      // Update local store
      set((state) => ({
        caseTypes: [...state.caseTypes, caseTypeObj],
      }));
    } catch (error) {
      console.error("Error adding case type:", error);
    }
  },


  // Fetch all cases
  fetchCases: async () => {
  set({ loading: true });

  try {
    if (unsubscribeCases) {
      unsubscribeCases();
    }

    // Order by createdAt (or updatedAt if you add it later)
    const q = query(collection(db, "cases"), orderBy("createdAt", "desc"));

    unsubscribeCases = onSnapshot(
      q,
      (snapshot) => {
        const allCases: Case[] = snapshot.docs.map(mapDocToCase);
        const recentCases = allCases.slice(0, 10);

        const updatedCaseTypes = get().caseTypes.map((ct) => ({
          ...ct,
          count: allCases.filter((c) => c.caseType === ct.id).length,
        }));

        set({
          cases: allCases,
          recentCases,             
          recentUpdates: recentCases.map((c) => ({
            id: c.id,
            case: c.caseNumber,
            student: c.studentName,
            action: "Created",
            time: c.createdAt,
            level: c.level ?? "", // Provide a default or adjust as needed
            status: c.status ?? "active", // Provide a default or adjust as needed
          })), // ✅ map recentUpdates to CaseUpdate[]
          caseTypes: updatedCaseTypes,
          loading: false,
        });
      },
      (error) => {
        console.error("Error fetching cases:", error);
        set({ loading: false });
      }
    );
  } catch (error) {
    console.error("Error setting up fetchCases listener:", error);
    set({ loading: false });
  }

  return; // satisfies Promise<void>
},

// Add new case
addCase: async (newCase: NewCase) => {
  try {
    const caseId =  generateCaseId();
    const investigators = ["Dr. Smith", "Prof. Johnson", "Mrs. Lee"];

    const caseData: Omit<Case, "id"> = {
      caseNumber: caseId,
      ...newCase,
      assignedInvestigator: newCase.assignedInvestigator || investigators[0],
      status: "active",
      createdAt: new Date().toISOString(),
      media: null,
    };

    const caseRef = await addDoc(collection(db, "cases"), caseData);

    const newCaseWithId: Case = { ...caseData, id: caseRef.id };

    if (newCase.studentEmail) {
      emailService.notifyCaseCreated(caseId, newCase.studentEmail, newCase.studentName);
    }

    set((state) => {
      const updatedCases = [newCaseWithId, ...state.cases];
      const updatedRecent = updatedCases.slice(0, 10);
      return {
        cases: updatedCases,
        recentCases: updatedRecent,
        recentUpdates: updatedRecent.map((c) => ({
          id: c.id,
          case: c.caseNumber,
          student: c.studentName,
          action: "Created",
          time: c.createdAt,
          level: c.level ?? "",
          status: c.status ?? "active",
        })),
      };
    });

    if (newCase.media) {
      const mediaUrl = await uploadToCloudinary(newCase.media);
      await updateDoc(caseRef, { media: mediaUrl });

      set((state) => ({
        cases: state.cases.map((c) =>
          c.id === caseRef.id ? { ...c, media: mediaUrl } : c
        ),
      }));
    }
  } catch (error) {
    console.error("Error adding case:", error);
  }

  set({ isCreateCaseModalOpen: false });
},

  // Update case
  updateCase: async (
    caseId: string,
    updates: Partial<Omit<Case, "media">> & { media?: File | null }
  ) => {
    try {
      const caseRef = doc(db, "cases", caseId);
      const { media, ...restUpdates } = updates;

      await updateDoc(caseRef, restUpdates);
      set((state) => ({
        cases: state.cases.map((c) =>
          c.id === caseId ? { ...c, ...restUpdates } : c
        ),
      }));

      if (media) {
        const mediaUrl = await uploadToCloudinary(media);
        await updateDoc(caseRef, { media: mediaUrl });
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === caseId ? { ...c, media: mediaUrl } : c
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating case:", error);
      throw error;
    }
  },

  // Update status only
  updateCaseStatus: async (caseId: string, status: Case["status"]) => {
    try {
      await updateDoc(doc(db, "cases", caseId), { status });
      await get().fetchCases();
    } catch (error) {
      console.error("Error updating case status:", error);
    }
  },

  // Delete case
  deleteCase: async (caseId: string) => {
    try {
      await deleteDoc(doc(db, "cases", caseId));
      set((state) => ({
        cases: state.cases.filter((c) => c.id !== caseId),
        recentCases: state.recentCases.filter((c) => c.id !== caseId),
      }));
    } catch (error) {
      console.error("Error deleting case:", error);
    }
  },

  // Preview
  setSelectedCase: (caseItem: Case | null) => set({ selectedCase: caseItem }),

  // Track local updates
  addCaseUpdate: (update: Omit<CaseUpdate, "id">) => {
    const newUpdate: CaseUpdate = { ...update, id: Date.now().toString() };
    set((state) => ({
      recentUpdates: [newUpdate, ...state.recentUpdates.slice(0, 9)],
    }));
  },

  openCreateCaseModal: () => set({ isCreateCaseModalOpen: true }),
  closeCreateCaseModal: () => set({ isCreateCaseModalOpen: false }),
  getCaseTypeById: (id: string) => get().caseTypes.find((ct) => ct.id === id),
}));
