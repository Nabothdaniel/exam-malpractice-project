export interface User {
  id: string;
  email: string;
  name: string;
  role: "superadmin" | "admin" | "investigator" | "viewer";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  userProfile: User | null; // 🔹 separate profile state
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUserProfile: () => Promise<void>; // 🔹 auto-fetch for logged-in user
}

export interface CaseType {
  id: string;
  title: string;
  scope: string;
  description: string;
  status: string;
  color: string;
  count: number;
}

export interface Case {
  id: string;
  caseNumber:string;
  studentName: string;
  matricNumber: string;
  studentEmail: string;
  department: string;
  caseType: string;
  level: string;
  description: string;
  priority: "low" | "medium" | "high";
  assignedInvestigator: string;
  status: "active" | "pending" | "resolved" | "investigating";
  createdAt: string;
  media: string | null;
}

export interface CaseUpdate {
  id: string;
  case: string;
  student: string;
  action: string;
  level: string;
  time: string;
  status: "active" | "pending" | "resolved" | "investigating";
}

export interface NewCase {
  studentName: string;
  matricNumber: string;
  studentEmail: string;
  department: string;
  caseType: string;
  description: string;
  level: string;
  priority: "low" | "medium" | "high";
  assignedInvestigator: string;
  media: File | null;
}

export interface CaseStore {
  caseTypes: {
    id: string;
    title: string;
    scope: string;
    description: string;
    count: number;
    status: string;
    color: string;
  }[];

  cases: Case[];
  recentCases: Case[];
  recentUpdates: CaseUpdate[];
  isCreateCaseModalOpen: boolean;
  loading: boolean;

  selectedCase: Case | null;
  setSelectedCase: (c: Case | null) => void;
  deleteCase: (caseId: string) => Promise<void>;

  fetchCases: () => Promise<void>;
  addCase: (newCase: NewCase) => Promise<void>;

  // ✅ Updated method signature:
  updateCase: (
    caseId: string,
    updates: Partial<Omit<Case, "media">> & { media?: File | null }
  ) => Promise<void>;

  updateCaseStatus: (caseId: string, status: Case["status"]) => Promise<void>;
  addCaseUpdate: (update: Omit<CaseUpdate, "id">) => void;
  openCreateCaseModal: () => void;
  closeCreateCaseModal: () => void;
  getCaseTypeById: (id: string) => { id: string; title: string } | undefined;
}

export interface Investigator {
  id: string
  name: string
  email: string
  department: string
  role: "investigator" | "admin" // if needed
  assignedCases?: string[] // array of Case IDs (optional)
}

export interface Student {
  id: string
  name: string
  matricNumber: string
  email: string
  department: string
  cases?: string[] // array of Case IDs
}



