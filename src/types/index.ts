export interface CaseType {
  id: string
  title: string
  scope: string
  description: string
  status: string
  color: string
  count: number
}

export interface Case {
  id: string
  studentName: string
  matricNumber: string
  studentEmail: string
  department: string
  caseType: string 
  description: string
  priority: "low" | "medium" | "high"
  assignedInvestigator: string
  status: "active" | "pending" | "resolved" | "investigating"
  createdAt: string
  media: string | null
}

export interface CaseUpdate {
  id: string
  case: string
  student: string
  action: string
  time: string
  status: "active" | "pending" | "resolved" | "investigating"
}

export interface NewCase {
  studentName: string
  matricNumber: string
  studentEmail: string
  department: string
  caseType: string
  description: string
  priority: "low" | "medium" | "high"
  assignedInvestigator: string
  media: File | null
}

export interface CaseStore {
  caseTypes: {
    id: string
    title: string
    scope: string
    description: string
    count: number
    status: string
    color: string
  }[]

  cases: Case[]
  recentCases: Case[] 
  recentUpdates: CaseUpdate[]
  isCreateCaseModalOpen: boolean
  loading: boolean

  
  selectedCase: Case | null
  setSelectedCase: (c: Case | null) => void
  deleteCase: (caseId: string) => Promise<void>

  fetchCases: () => Promise<void>
  addCase: (newCase: NewCase) => Promise<void>
  updateCaseStatus: (caseId: string, status: Case["status"]) => Promise<void>
  addCaseUpdate: (update: Omit<CaseUpdate, "id">) => void
  openCreateCaseModal: () => void
  closeCreateCaseModal: () => void
  getCaseTypeById: (id: string) => { id: string; title: string } | undefined
}

