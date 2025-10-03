// utils/emailApi.ts
import axios from "axios";

const API_BASE_URL = "https://exam-malpractice-backend.onrender.com/api/email";

const API_BASE_URL_LOCAL = "http://localhost:4000/api/email";

interface CaseCreatedPayload {
  caseId: string;
  studentName: string;
  caseType: string;
  studentEmails?: string[]; // optional if backend sends default recipients
  investigatorEmails?: string[]; // optional
}

interface StatusUpdatePayload {
  caseId: string;
  studentName: string;
  oldStatus: string;
  newStatus: string;
  action: string;
  recipients?: string[]; // optional
}

interface CaseResolvedPayload {
  caseId: string;
  studentName: string;
  resolution: string;
  recipients?: string[];
}

// Axios instance 
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const emailApi = {
  notifyCaseCreated: async (payload: CaseCreatedPayload) => {
    const response = await axiosInstance.post("/case-created", payload);
    console.log("case created email response:", response.data);

    return response.data;
  },

  notifyStatusUpdate: async (payload: StatusUpdatePayload) => {
    const response = await axiosInstance.post("/status-update", payload);
    return response.data;
  },

  notifyCaseResolved: async (payload: CaseResolvedPayload) => {
    const response = await axiosInstance.post("/case-resolved", payload);
    return response.data;
  },

  getNotifications: async () => {
    const response = await axiosInstance.get("/notifications");
    return response.data;
  },

  getNotificationsByCaseId: async (caseId: string) => {
    const response = await axiosInstance.get(`/notifications/${caseId}`);
    return response.data;
  },
};
