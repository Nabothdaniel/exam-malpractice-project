import { create } from "zustand"
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  limit, 
  QueryDocumentSnapshot 
} from "firebase/firestore"
import { db } from "../firebase/firebase"
import { generateCaseId } from "../utils/helperFunctions"
import { emailService } from "../services/emailService"
import type { Case, CaseUpdate, NewCase, CaseStore } from "@/types"

const mapDocToCase = (docSnap: QueryDocumentSnapshot): Case => {
  const data = docSnap.data() as Omit<Case, "id">
  return {
    id: docSnap.id,
    ...data,
  }
}

export const useCaseStore = create<CaseStore>((set, get) => ({
  caseTypes: [
    {
      id: "caseType1",
      title: "Academic Misconduct",
      scope: "Cheating, plagiarism, exam malpractice",
      description: "Cases involving academic integrity violations",
      count: 0,
      status: "active",
      color: "bg-red-100 text-red-700 border-red-200",
    },
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
  selectedCase: null, // ✅ for previewing a single case
  isCreateCaseModalOpen: false,
  loading: false,

  // ✅ Fetch cases
  fetchCases: async () => {
    set({ loading: true })
    try {
      const allCasesSnapshot = await getDocs(
        query(collection(db, "cases"), orderBy("createdAt", "desc"))
      )
      const allCases: Case[] = allCasesSnapshot.docs.map(mapDocToCase)

      const recentSnapshot = await getDocs(
        query(collection(db, "cases"), orderBy("createdAt", "desc"), limit(10))
      )
      const recentCases: Case[] = recentSnapshot.docs.map(mapDocToCase)

      const updatedCaseTypes = get().caseTypes.map((ct) => ({
        ...ct,
        count: allCases.filter((c) => c.caseType === ct.id).length,
      }))

      set({
        cases: allCases,
        caseTypes: updatedCaseTypes,
        recentCases,
      })
    } catch (error) {
      console.error("Error fetching cases:", error)
    } finally {
      set({ loading: false })
    }
  },

  // ✅ Add case
  addCase: async (newCase: NewCase) => {
    try {
      const caseId = await generateCaseId()
      const investigators = ["Dr. Smith", "Prof. Johnson", "Mrs. Lee"]

      const caseData: Case = {
        id: caseId,
        ...newCase,
        assignedInvestigator: newCase.assignedInvestigator || investigators[0],
        status: "active",
        createdAt: new Date().toISOString(),
        media: newCase.media ? newCase.media.name : null,
      }

      await addDoc(collection(db, "cases"), caseData)

      if (newCase.studentEmail) {
        emailService.notifyCaseCreated(caseId, newCase.studentEmail, newCase.studentName)
      }

      set((state) => {
        const updatedCases = [caseData, ...state.cases]
        return {
          cases: updatedCases,
          recentCases: updatedCases.slice(0, 10),
        }
      })

      await get().fetchCases()
    } catch (error) {
      console.error("Error adding case:", error)
    }
    set({ isCreateCaseModalOpen: false })
  },

  // ✅ Update status
  updateCaseStatus: async (caseId: string, status: Case["status"]) => {
    try {
      await updateDoc(doc(db, "cases", caseId), { status })
      await get().fetchCases()
    } catch (error) {
      console.error("Error updating case status:", error)
    }
  },

  // ✅ Delete case
  deleteCase: async (caseId: string) => {
    try {
      await deleteDoc(doc(db, "cases", caseId))
      set((state) => ({
        cases: state.cases.filter((c) => c.id !== caseId),
        recentCases: state.recentCases.filter((c) => c.id !== caseId),
      }))
    } catch (error) {
      console.error("Error deleting case:", error)
    }
  },

  // ✅ Preview a case
  setSelectedCase: (caseItem: Case | null) => set({ selectedCase: caseItem }),

  // ✅ Track updates (local only)
  addCaseUpdate: (update: Omit<CaseUpdate, "id">) => {
    const newUpdate: CaseUpdate = { ...update, id: Date.now().toString() }
    set((state) => ({
      recentUpdates: [newUpdate, ...state.recentUpdates.slice(0, 9)],
    }))
  },

  openCreateCaseModal: () => set({ isCreateCaseModalOpen: true }),
  closeCreateCaseModal: () => set({ isCreateCaseModalOpen: false }),
  getCaseTypeById: (id: string) => get().caseTypes.find((ct) => ct.id === id),
}))
