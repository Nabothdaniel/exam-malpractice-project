import { create } from "zustand";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase"; 
import type { Case,Student } from "@/types"

// ----------------------
// Types
// ----------------------
interface StudentWithCases extends Omit<Student, "cases"> {
  cases: Case[]  // replace string[] with full case objects
  totalCases: number
  activeCases: number
  resolvedCases: number
  riskLevel: "low" | "medium" | "high"
  lastIncident: string | null
}
interface StudentsStore {
  students: StudentWithCases[];
  loading: boolean;
  fetchStudents: () => Promise<void>;
}

// ----------------------
// Store
// ----------------------
export const useStudentsStore = create<StudentsStore>((set) => ({
  students: [],
  loading: false,

  fetchStudents: async () => {
    try {
      set({ loading: true });

      // 1️⃣ Get all students
      const studentsSnapshot = await getDocs(collection(db, "students"));
      const students: StudentWithCases[] = [];

      for (const studentDoc of studentsSnapshot.docs) {
        const studentData = studentDoc.data() as Student;

        // 2️⃣ Query cases for this student
        const casesQuery = query(
          collection(db, "cases"),
          where("studentId", "==", studentDoc.id)
        );
        const casesSnapshot = await getDocs(casesQuery);
        const cases: Case[] = casesSnapshot.docs.map((doc) => {
          const { id, ...caseData } = doc.data() as Case;
          return {
            id: doc.id,
            ...caseData,
          };
        });

        students.push({
          ...studentData,
          id: studentDoc.id,
          cases,
          totalCases: cases.length,
          activeCases: cases.filter(c => c.status === "active").length,
          resolvedCases: cases.filter(c => c.status === "resolved").length,
          riskLevel: cases.some(c => c.riskLevel === "high")
            ? "high"
            : cases.some(c => c.riskLevel === "medium")
              ? "medium"
              : "low",
          lastIncident: cases.length > 0
            ? cases.reduce((latest, c) =>
                new Date(c.createdAt) > new Date(latest) ? c.createdAt : latest,
                cases[0].createdAt
              )
            : null
        });
      }

      set({ students, loading: false });
    } catch (error) {
      console.error("Error fetching students with cases:", error);
      set({ loading: false });
    }
  },
}));
