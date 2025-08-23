import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";

export const generateCaseId = async () => {
  const now = new Date();

  // Get year, day, and month
  const year = now.getFullYear();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");

  // Fetch total number of cases today to use as order
  // (example assumes cases are stored in "cases" collection in Firestore)
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  const q = query(
    collection(db, "cases"),
    where("createdAt", ">=", startOfDay),
    where("createdAt", "<=", endOfDay)
  );

  const snapshot = await getDocs(q);
  const order = String(snapshot.size + 1).padStart(2, "0"); // ensures 2 digits

  // Final Case ID
  return `CASE-${year}-${day}${month}${order}`;
};

export const getStatusBadge = (status: string) => {
  const statusConfig = {
    active: {
      label: "Active",
      className: "bg-red-100 text-red-800 border-red-200",
    },
    pending: {
      label: "Pending",
      className: "bg-gray-100 text-gray-800 border-gray-200",
    },
    resolved: {
      label: "Resolved",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    investigating: {
      label: "Investigating",
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
  };
  return (
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  );
};

export function setPageTitle(pageName?: string): void {
  const appName = "ExamGuard";
  document.title = pageName ? `${pageName} | ${appName}` : appName;
}
