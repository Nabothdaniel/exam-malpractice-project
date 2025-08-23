import React, { useState } from "react"
import type { CaseType, Case } from "../types"
import { getStatusBadge } from "@/utils/helperFunctions"

interface CaseCardsProps {
  caseTypes: CaseType[]
  cases: Case[]
}

const CaseCards: React.FC<CaseCardsProps> = ({ caseTypes, cases }) => {
  const [selectedCaseType, setSelectedCaseType] = useState<CaseType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = (caseType: CaseType) => {
    setSelectedCaseType(caseType)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedCaseType(null)
    setIsModalOpen(false)
  }

  const filteredCases = selectedCaseType
    ? cases.filter((c) => c.caseType === selectedCaseType.id)
    : []

  return (
    <>
      {/* Case Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {caseTypes.map((caseType) => (
          <div
            key={caseType.id}
            onClick={() => handleCardClick(caseType)}
            className={`case-card bg-gray-100 rounded-lg border border-gray-300 p-6 
              cursor-pointer transition-colors
              hover:bg-gray-200 active:bg-gray-300 focus:bg-gray-200`}
          >
            <div className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{caseType.title}</h3>
                  <p className="text-sm text-gray-600">{caseType.scope}</p>
                </div>
                <span className="text-lg font-semibold px-3 py-1 bg-gray-200 rounded-md text-gray-800">
                  {caseType.count}
                </span>
              </div>
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

      {/* Modal */}
      {isModalOpen && selectedCaseType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl mx-2 sm:mx-5">
            {/* Header */}
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

            {/* Table */}
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
                        {/* Student Name */}
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">
                            {caseItem.studentName}
                          </div>
                        </td>

                        {/* Matric */}
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {caseItem.matricNumber}
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {caseItem.studentEmail}
                        </td>

                        {/* Description */}
                        <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                          {caseItem.description}
                        </td>

                        {/* Priority Badge */}
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium
                              ${caseItem.priority === "high"
                                ? "bg-red-200 text-red-800"
                                : caseItem.priority === "medium"
                                  ? "bg-yellow-200 text-yellow-800"
                                  : "bg-green-200 text-green-800"
                              }`}
                          >
                            {caseItem.priority}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium
                              ${caseItem.status === "active"
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

                        {/* Created At */}
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(caseItem.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600 text-center">No cases found for this type.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CaseCards
