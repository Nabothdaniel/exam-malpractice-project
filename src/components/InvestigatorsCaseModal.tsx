// components/InvestigatorCasesModal.tsx
import { FiX } from "react-icons/fi"

interface Props {
  investigator: { id: string; name: string }
  cases: any[]
  onClose: () => void
}

const InvestigatorCasesModal = ({ investigator, cases, onClose }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/20  bg-opacity-50 flex items-center justify-center px-5 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full p-6 ">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Cases Assigned to {investigator.name}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {cases.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Student</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Matric</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Priority</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((caseItem) => (
                  <tr
                    key={caseItem.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">{caseItem.studentName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{caseItem.matricNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{caseItem.studentEmail}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{caseItem.description}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          caseItem.priority === "high"
                            ? "bg-red-200 text-red-800"
                            : caseItem.priority === "medium"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {caseItem.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          caseItem.status === "active"
                            ? "bg-blue-200 text-blue-800"
                            : caseItem.status === "pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : caseItem.status === "resolved"
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {caseItem.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(caseItem.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600 py-6">No cases found for this investigator.</p>
        )}
      </div>
    </div>
  )
}

export default InvestigatorCasesModal
