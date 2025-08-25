

export const generateCaseId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000); 

  return `CASE-${year}-${day}${month}-${random}`;
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
