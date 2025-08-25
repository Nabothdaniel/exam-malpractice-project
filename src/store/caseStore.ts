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
import type { Case, CaseUpdate, NewCase, CaseStore } from "@/types";
import { uploadToCloudinary } from "../utils/cloudinary"; 

const mapDocToCase = (docSnap: QueryDocumentSnapshot): Case => {
  const data = docSnap.data() as Omit<Case, "id">;
  return { id: docSnap.id, ...data };
};

let unsubscribeCases: (() => void) | null = null;


export const useCaseStore = create<CaseStore>((set, get) => ({
  caseTypes: [
    {
      id: "caseType2",
      title: "Exam Malpractice",
      scope: "Unauthorized materials, impersonation",
      description: "Cases related to misconduct during exams",
      count: 0,
      status: "active",
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
  ],

  cases: [],
  recentCases: [],
  recentUpdates: [],
  selectedCase: null,
  isCreateCaseModalOpen: false,
  loading: false,

  // Fetch all cases
  fetchCases: async () => {
  set({ loading: true });

  try {
    if (unsubscribeCases) {
      unsubscribeCases();
    }

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
    const caseId = await generateCaseId();
    const investigators = ["Dr. Smith", "Prof. Johnson", "Mrs. Lee"];

    const caseData: Omit<Case, "id"> = {
      caseNumber: caseId,
      ...newCase,
      assignedInvestigator: newCase.assignedInvestigator || investigators[0],
      status: "active",
      createdAt: new Date().toISOString(),
      media: null,
    };

    // Let Firestore assign the doc ID
    const caseRef = await addDoc(collection(db, "cases"), caseData);

    // Save doc ID separately in state so you can use it for updates
    const newCaseWithId: Case = { ...caseData, id: caseRef.id };

    if (newCase.studentEmail) {
      emailService.notifyCaseCreated(caseId, newCase.studentEmail, newCase.studentName);
    }

    set((state) => ({
      cases: [newCaseWithId, ...state.cases],
      recentCases: [newCaseWithId, ...state.cases].slice(0, 10),
    }));

    // Upload media if exists
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
