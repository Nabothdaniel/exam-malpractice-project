// src/store/investigatorsStore.ts
import { create } from "zustand"
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore"
import { db } from "@/firebase/firebase"
import type { Case } from "@/types"
// Investigator type
export interface Investigator {
  id: string
  name: string
  email: string
  department: string
  specialization: string
  avatar?: string
  status: "active" | "inactive"
  joinDate: string
  activeCases: number
  resolvedCases: number
  totalCases: number
}

interface InvestigatorStore {
  investigators: Investigator[]
  loading: boolean

  // actions
  fetchInvestigators: () => void
  addInvestigator: (data: Omit<Investigator, "id" | "activeCases" | "resolvedCases" | "totalCases">) => Promise<void>
  updateInvestigatorStats: (cases: Case[]) => Promise<void>
}

export const useInvestigatorsStore = create<InvestigatorStore>((set, get) => ({
  investigators: [],
  loading: false,

  // 🔹 Real-time sync with Firestore
  fetchInvestigators: () => {
    set({ loading: true })
    const q = collection(db, "investigators")

    // snapshot listener (unsubscribe on signout if needed)
    onSnapshot(q, (snapshot) => {
      const data: Investigator[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Investigator[]
      set({ investigators: data, loading: false })
    })
  },

  // 🔹 Add a new investigator
  addInvestigator: async (data) => {
    try {
      await addDoc(collection(db, "investigators"), {
        ...data,
        status: "active",
        joinDate: new Date().toISOString(),
        activeCases: 0,
        resolvedCases: 0,
        totalCases: 0,
      })
    } catch (err) {
      console.error("Error adding investigator:", err)
    }
  },

  // 🔹 Update investigator stats whenever cases change
  updateInvestigatorStats: async (cases: Case[]) => {
    try {
      // group cases by assignedInvestigator
      const grouped: Record<string, { active: number; resolved: number }> = {}

      cases.forEach((c) => {
        if (!c.assignedInvestigator) return
        if (!grouped[c.assignedInvestigator]) {
          grouped[c.assignedInvestigator] = { active: 0, resolved: 0 }
        }
        if (c.status === "active" || c.status === "pending") {
          grouped[c.assignedInvestigator].active++
        } else if (c.status === "resolved") {
          grouped[c.assignedInvestigator].resolved++
        }
      })

      // update each investigator in Firestore
      const investigators = get().investigators
      await Promise.all(
        investigators.map(async (inv) => {
          const stats = grouped[inv.name] || { active: 0, resolved: 0 }
          await updateDoc(doc(db, "investigators", inv.id), {
            activeCases: stats.active,
            resolvedCases: stats.resolved,
            totalCases: stats.active + stats.resolved,
          })
        })
      )
    } catch (err) {
      console.error("Error updating investigator stats:", err)
    }
  },
}))
