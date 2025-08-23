"use client"

import { useState, useEffect } from "react"
import { FiSearch, FiEye, FiEdit, FiTrash2, FiPlus, FiX } from "react-icons/fi"
import { useCaseStore } from "../store/caseStore"
import { toast } from "react-toastify"
import { setPageTitle } from "@/utils/helperFunctions"
import EditStatusModal from "@/components/EditStatusModal"

const CasesPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  useEffect(() => {
    setPageTitle(" Cases")
  }, [])

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCase, setSelectedCase] = useState<any>(null)
  const [newStatus, setNewStatus] = useState<"active" | "pending" | "resolved" | "investigating">("active")


  const {
    cases,
    fetchCases,
    openCreateCaseModal,
    updateCaseStatus,
    deleteCase,
  } = useCaseStore()

  useEffect(() => {
    fetchCases()
  }, [fetchCases])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Active", className: "bg-red-100 text-red-800 border-red-200" },
      pending: { label: "Pending", className: "bg-gray-100 text-gray-800 border-gray-200" },
      resolved: { label: "Resolved", className: "bg-green-100 text-green-800 border-green-200" },
      investigating: { label: "Investigating", className: "bg-blue-100 text-blue-800 border-blue-200" },
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  }

  const filteredCases = cases.filter((case_) => {
    const matchesSearch =
      case_.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.caseType?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || case_.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // 🟢 Handlers
  const handlePreview = (case_: any) => {
    setSelectedCase(case_)
    setIsPreviewOpen(true)
  }

  const handleEditStatus = (case_: any) => {
    setSelectedCase(case_)
    setNewStatus(case_.status)
    setIsEditOpen(true)
  }

  const handleDelete = (case_: any) => {
    setSelectedCase(case_)
    setIsDeleteOpen(true)
  }

  const confirmStatusUpdate = async () => {
    try {
      await updateCaseStatus(selectedCase.id, newStatus)
      toast.success("Case status updated successfully")
      setIsEditOpen(false)
    } catch (err) {
      toast.error("Failed to update case status")
    }
  }

  const confirmDelete = async () => {
    try {
      await deleteCase(selectedCase.id)
      toast.success("Case deleted successfully")
      setIsDeleteOpen(false)
    } catch (err) {
      toast.error("Failed to delete case")
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* 🔹 Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">All Cases</h1>
            <p className="text-gray-600 mt-1">Manage and track all exam malpractice cases</p>
          </div>
          <button
            onClick={openCreateCaseModal}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            New Case
          </button>
        </div>

        {/* 🔹 Filters + Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search cases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="investigating">Investigating</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* 🔹 Cases Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Case ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Assigned</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((case_) => (
                  <tr key={case_.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{case_.id}</td>
                    <td className="px-6 py-4">{case_.studentName}</td>
                    <td className="px-6 py-4">{case_.caseType}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusBadge(case_.status).className}`}>
                        {getStatusBadge(case_.status).label}
                      </span>
                    </td>
                    <td className="px-6 py-4">{case_.assignedInvestigator}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => handlePreview(case_)} className="text-blue-600"><FiEye /></button>
                      <button onClick={() => handleEditStatus(case_)} className="text-gray-600"><FiEdit /></button>
                      <button onClick={() => handleDelete(case_)} className="text-red-600"><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🔹 Preview Modal */}
        {isPreviewOpen && selectedCase && (
          <Modal onClose={() => setIsPreviewOpen(false)} title="Case Details">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2 py-6">
              {/* Left side - Case main info */}
              <div className="md:col-span-2 bg-white rounded-2xl px-3 py-6 shadow-sm">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Case — {selectedCase.caseType}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${selectedCase.status === "resolved"
                        ? "bg-green-100 text-green-700"
                        : selectedCase.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : selectedCase.status === "investigating"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {selectedCase.status}
                  </span>
                </div>

                {/* Case Details */}
                <div className="space-y-2 text-sm text-gray-700">
                  <p><strong>ID:</strong> {selectedCase.id}</p>
                  <p><strong>Student:</strong> {selectedCase.studentName} ({selectedCase.matricNumber})</p>
                  <p><strong>Email:</strong> {selectedCase.studentEmail}</p>
                  <p><strong>Department:</strong> {selectedCase.department}</p>
                  <p>
                    <strong>Priority:</strong>{" "}
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${selectedCase.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : selectedCase.priority === "medium"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                    >
                      {selectedCase.priority}
                    </span>
                  </p>
                  <p><strong>Investigator:</strong> {selectedCase.assignedInvestigator}</p>
                  <p><strong>Created At:</strong> {new Date(selectedCase.createdAt).toLocaleString()}</p>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-600">{selectedCase.description}</p>
                </div>

                {/* Media */}
                {selectedCase.media && (
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Evidence / Media</h3>
                    <img
                      src={selectedCase.media}
                      alt="Case Media"
                      className="w-full max-h-64 object-cover rounded-lg shadow"
                    />
                  </div>
                )}
              </div>

              {/* Right side - Quick info */}
              <div className="bg-gray-50 shadow rounded-2xl p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-600">Case Role</h4>
                  <p className="mt-1 text-gray-800">Assigned Investigator: {selectedCase.assignedInvestigator}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-600">Case Progress</h4>
                  <div className="mt-2 bg-gray-200 rounded-full h-2 w-full">
                    <div
                      className={`h-2 rounded-full ${selectedCase.status === "resolved"
                          ? "bg-green-500 w-full"
                          : selectedCase.status === "investigating"
                            ? "bg-blue-500 w-2/3"
                            : selectedCase.status === "pending"
                              ? "bg-yellow-500 w-1/3"
                              : "bg-gray-400 w-1/5"
                        }`}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-600">Labels</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                      {selectedCase.caseType}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                      {selectedCase.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </Modal>
        )}

        {/* 🔹 Edit Status Modal */}
        {isEditOpen && selectedCase && (
          <Modal onClose={() => setIsEditOpen(false)} title="Update Status">
           <EditStatusModal selectedCaseId={selectedCase.id} onClose={() => setIsEditOpen(false)} />
          </Modal>
        )}

        {/* 🔹 Delete Modal */}
        {isDeleteOpen && selectedCase && (
          <Modal onClose={() => setIsDeleteOpen(false)} title="Delete Case">
            <p>Are you sure you want to delete <strong>{selectedCase.id}</strong>?</p>
            <div className="flex gap-3 mt-4">
              <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 cursor-pointer rounded-md">Yes, Delete</button>
              <button onClick={() => setIsDeleteOpen(false)} className="bg-gray-200 px-4 py-2 rounded-md">Cancel</button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}

// 🟢 Reusable Modal Component
const Modal = ({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) => (
  <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-lg w-full max-w-5xl relative max-h-[90vh] overflow-y-auto p-6">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-5 text-3xl cursor-pointer text-gray-500"
      >
        <FiX />
      </button>

      {/* Modal Title */}
      <h2 className="text-xl md:text-2xl font-semibold mb-6">{title}</h2>

      {/* Modal Content */}
      <div className="w-full">{children}</div>
    </div>
  </div>

)

export default CasesPage
