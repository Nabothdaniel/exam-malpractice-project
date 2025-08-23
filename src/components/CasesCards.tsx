import React, { useState } from "react"
import { FiPlus } from "react-icons/fi"
import type { CaseType, Case } from "../types"
import { getStatusBadge } from "@/utils/helperFunctions"

interface CaseCardsProps {
  caseTypes: CaseType[]
  cases: Case[]
  onAddCaseType: (newCaseType: Partial<CaseType>) => void
}

const CaseCards: React.FC<CaseCardsProps> = ({ caseTypes, cases, onAddCaseType }) => {
  const [selectedCaseType, setSelectedCaseType] = useState<CaseType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddTypeModalOpen, setIsAddTypeModalOpen] = useState(false)
  const [newCaseType, setNewCaseType] = useState<Partial<CaseType>>({
    title: "",
    scope: "",
    description: "",
    status: "active",
  })

  const handleCardClick = (caseType: CaseType) => {
    setSelectedCaseType(caseType)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedCaseType(null)
    setIsModalOpen(false)
  }

  const handleAddCaseTypeClick = () => setIsAddTypeModalOpen(true)

  const handleAddTypeSubmit = () => {
    if (newCaseType.title && newCaseType.scope && newCaseType.description) {
      onAddCaseType(newCaseType)
      setNewCaseType({ title: "", scope: "", description: "", status: "active" })
      setIsAddTypeModalOpen(false)
    }
  }

  const filteredCases = selectedCaseType
    ? cases.filter((c) => c.caseType === selectedCaseType.id)
    : []

  return (
    <>
      {/* Case Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Add Case Type Card */}
        <div
          onClick={handleAddCaseTypeClick}
          className="flex flex-col items-center justify-center border-2 border-dotted border-gray-400 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition"
        >
          <FiPlus className="text-4xl text-gray-500 mb-2" />
          <span className="text-gray-600 font-medium">Add Case Type</span>
        </div>

        {/* Existing Case Type Cards */}
        {caseTypes.map((caseType) => (
          <div
            key={caseType.id}
            onClick={() => handleCardClick(caseType)}
            className={`case-card bg-gray-100 rounded-lg border border-gray-300 p-6 
              cursor-pointer transition-colors
              hover:bg-gray-200 active:bg-gray-300 focus:bg-gray-200`}
          >
            <div className="pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{caseType.title}</h3>
                <p className="text-sm text-gray-600">{caseType.scope}</p>
              </div>
              <span className="text-lg font-semibold px-3 py-1 bg-gray-200 rounded-md text-gray-800">
                {caseType.count}
              </span>
            </div>
            <p className="text-sm mb-4 text-gray-700">{caseType.description}</p>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadge(
                caseType.status
              ).className}`}
            >
              {getStatusBadge(caseType.status).label}
            </span>
          </div>
        ))}
      </div>

      {/* Add Case Type Modal */}
      {isAddTypeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-2 sm:mx-5">
            <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Add New Case Type</h2>
              <button
                onClick={() => setIsAddTypeModalOpen(false)}
                className="text-gray-600 hover:text-gray-800 active:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={newCaseType.title}
                onChange={(e) => setNewCaseType({ ...newCaseType, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Scope"
                value={newCaseType.scope}
                onChange={(e) => setNewCaseType({ ...newCaseType, scope: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                placeholder="Description"
                value={newCaseType.description}
                onChange={(e) => setNewCaseType({ ...newCaseType, description: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <select
                value={newCaseType.status}
                onChange={(e) => setNewCaseType({ ...newCaseType, status: e.target.value as any })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsAddTypeModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTypeSubmit}
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Cases Modal */}
      {isModalOpen && selectedCaseType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl mx-2 sm:mx-5">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-300 pb-3">
              <h2 className="text-xl font-semibold text-gray-800">
                Cases for {selectedCaseType.title}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 active:text-gray-900"
              >
                ✕
              </button>
            </div>

            {/* Cases Table */}
            <div className="mt-4 max-h-[70vh] overflow-y-auto">
              {filteredCases.length > 0 ? (
                <table className="min-w-full border border-gray-300 rounded-lg">
                  <thead className="bg-gray-200">
                    <tr>
                      {["Student", "Matric Number", "Email", "Description", "Priority", "Status", "Created"].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {filteredCases.map((caseItem) => (
                      <tr
                        key={caseItem.id}
                        className="transition-colors hover:bg-gray-200 active:bg-gray-300 focus:bg-gray-200"
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
              ) : (
                <p className="text-center text-gray-600 py-6">No cases found for this type.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CaseCards
