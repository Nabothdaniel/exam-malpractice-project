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
  getDocs,
  where,
  QueryDocumentSnapshot
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { generateCaseId } from "../utils/helperFunctions";
import { emailService } from "../services/emailService";
import type { Case, CaseUpdate, NewCase, CaseStore,CaseType,Student } from "@/types";
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
            level: c.level ?? "", 
            status: c.status ?? "active", 
          })), //  map recentUpdates to CaseUpdate[]
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
    const caseId = generateCaseId();

    // 1️⃣ Find or create student
    const studentQuery = query(
      collection(db, "students"),
      where("email", "==", newCase.studentEmail)
    );
    const studentSnapshot = await getDocs(studentQuery);

    let studentRef;
    let studentData: Student | null = null;

    if (!studentSnapshot.empty) {
      studentRef = studentSnapshot.docs[0].ref;
      studentData = { id: studentSnapshot.docs[0].id, ...studentSnapshot.docs[0].data() } as Student;
    } else {
      studentRef = await addDoc(collection(db, "students"), {
        name: newCase.studentName,
        email: newCase.studentEmail,
        program: newCase.program || "",
        level: newCase.level || "",
        gender: newCase.gender || "other",
        createdAt: new Date().toISOString(),
        cases: [],
        caseStats: {
          total: 0,
          active: 0,
          resolved: 0,
          riskLevel: "low",
          lastIncident: null,
        },
      });
    }

    // 2️⃣ Create the case
    const caseData: Omit<Case, "id"> = {
  caseNumber: caseId,
  studentId: studentRef.id,
  studentName: newCase.studentName,
  studentEmail: newCase.studentEmail,
  assignedInvestigator: newCase.assignedInvestigator || "none",
  status: "active",
  createdAt: new Date().toISOString(),
  media: null,
  riskLevel: newCase.riskLevel || "low",
  lastIncident: new Date().toISOString(),
  level: newCase.level || "",
  matricNumber: newCase.matricNumber || "",
  department: newCase.department || "",
  program: newCase.program || "",
  caseType: newCase.caseType || "",
  gender: newCase.gender || "other",
  description: newCase.description || "",
  priority: newCase.priority || "normal",
};


    const caseRef = await addDoc(collection(db, "cases"), caseData);
    const newCaseWithId: Case = { ...caseData, id: caseRef.id };

    // 3️⃣ Update Student’s cases + stats
    const updatedCases = studentData?.cases ? [...studentData.cases, caseRef.id] : [caseRef.id];
    const updatedStats = {
      total: (studentData?.caseStats.total || 0) + 1,
      active: (studentData?.caseStats.active || 0) + 1,
      resolved: studentData?.caseStats.resolved || 0,
      riskLevel: newCase.riskLevel || "low",
      lastIncident: newCaseWithId.lastIncident,
    };

    await updateDoc(studentRef, {
      cases: updatedCases,
      caseStats: updatedStats,
    });

    // 4️⃣ Send notification
    if (newCase.studentEmail) {
      emailService.notifyCaseCreated(caseId, newCase.studentEmail, newCase.studentName);
    }

    // 5️⃣ Update local state
    set((state) => {
      const allCases = [newCaseWithId, ...state.cases];
      const recent = allCases.slice(0, 10);
      return {
        cases: allCases,
        recentCases: recent,
        recentUpdates: recent.map((c) => ({
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

    // 6️⃣ Upload media if provided
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
