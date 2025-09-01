import { useEffect, useState } from "react"
import {
  FiDownload,
  FiEye,
  FiEdit,
  FiPlus,
  FiUser,
  FiFileText,
} from "react-icons/fi"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "../firebase/firebase"
import AddInvestigatorModal from "../components/AddInvestigatorModal"
import { toast } from "react-toastify"
import { useExportData } from "@/hooks/useExportData";
import InvestigatorCasesModal from "@/components/InvestigatorsCaseModal"
import { useInvestigatorsStore } from "@/store/investigatorStore"

interface Investigator {
  id: string
  name: string
  email: string
  phone?: string
  role?: string
  department: string
  specialization: string
  status: "active" | "inactive"
  joinDate: string
  avatar?: string
}

interface Case {
  id: string
  assignedInvestigator: string
  status: "active" | "pending" | "resolved"
  studentName?: string
  matricNumber?: string
  createdAt?: string
}

const InvestigatorsPage = () => {
  const [investigators, setInvestigators] = useState<Investigator[]>([])
  const [cases, setCases] = useState<Case[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedInvestigator, setSelectedInvestigator] = useState<Investigator | null>(null)
  const { updateInvestigatorStatus } = useInvestigatorsStore()
 const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const handleStatusChange = async (id: string, status: "active" | "inactive") => {
    await updateInvestigatorStatus(id, status)
    setOpenDropdownId(null) // close after update
  }

  

  // Listen to investigators
  useEffect(() => {
    try {
      const q = query(collection(db, "investigators"), orderBy("createdAt", "desc"))
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Investigator[]
          setInvestigators(list)
          setError(null)
        },
        (err) => {
          console.error("Error fetching investigators:", err)
          toast.error("Failed to fetch investigators. Please try again later.")
          setError("Failed to fetch investigators. Please try again later.")
        }
      )
      return () => unsubscribe()
    } catch (err) {
      console.error("Firestore listener error:", err)
      setError("An unexpected error occurred.")
    }
  }, [])

  // Listen to cases
  useEffect(() => {
    try {
      const q = collection(db, "cases")
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Case[]
        setCases(list)
      })
      return () => unsubscribe()
    } catch (err) {
      console.error("Firestore listener error for cases:", err)
    }
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Active", className: "bg-green-100 text-green-800" },
      inactive: { label: "Inactive", className: "bg-gray-100 text-gray-800" },
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.active
  }

  const investigatorColumns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Department", accessor: "department" },
    { header: "Specialization", accessor: "specialization" },
    { header: "Status", accessor: "status" },
    { header: "Total Cases", accessor: "totalCases" },
    { header: "Active Cases", accessor: "activeCases" },
    { header: "Resolved Cases", accessor: "resolvedCases" },
  ];




  // Compute case stats dynamically
  const enhancedInvestigators = investigators.map((inv) => {
    const assigned = cases.filter((c) => c.assignedInvestigator === inv.name)
    const active = assigned.filter((c) => c.status === "active" || c.status === "pending").length
    const resolved = assigned.filter((c) => c.status === "resolved").length
    return {
      ...inv,
      totalCases: assigned.length,
      activeCases: active,
      resolvedCases: resolved,
    }
  })


  // 🔹 Hook for export
  const { exportToExcel } = useExportData(
    investigatorColumns,
    enhancedInvestigators,
    "investigators"
  );

  const filteredInvestigators = enhancedInvestigators.filter((inv) => {
    const matchesSearch =
      inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || inv.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const assignedCases = selectedInvestigator
    ? cases.filter((c) => c.assignedInvestigator === selectedInvestigator.name)
    : []

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Investigators</h1>
              <p className="text-gray-600 mt-1">Manage investigation team and track their case assignments</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={exportToExcel}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Export Excel
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Investigator
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUser className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Investigators</p>
                <p className="text-2xl font-semibold text-gray-900">{investigators.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FiFileText className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Cases</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {enhancedInvestigators.reduce((sum, i) => sum + i.activeCases, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiFileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved Cases</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {enhancedInvestigators.reduce((sum, i) => sum + i.resolvedCases, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Investigators Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Investigator
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cases
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvestigators.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src="/male-investigator.png"
                          alt="Investigator"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{inv.name}</div>
                          <div className="text-sm text-gray-500">{inv.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{inv.specialization}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Total: {inv.totalCases}</div>
                      <div className="text-sm text-gray-500">
                        Active: {inv.activeCases} | Resolved: {inv.resolvedCases}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(inv.status).className}`}
                      >
                        {getStatusBadge(inv.status).label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                      <div className="flex space-x-2">
                        {/* 👁 View Button */}
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => setSelectedInvestigator(inv)}
                        >
                          <FiEye className="w-4 h-4" />
                        </button>

                        {/* ✏️ Edit / Status Dropdown */}
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          onClick={() =>
                            setOpenDropdownId(openDropdownId === inv.id ? null : inv.id)
                          }
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>

                        {/* ✅ Proper dropdown - only one opens at a time */}
                        {openDropdownId === inv.id && (
                          <select
                            className="absolute top-8 right-0 border rounded-md px-2 py-1 text-sm shadow-md"
                            value={inv.status}
                            onChange={(e) =>
                              handleStatusChange(inv.id, e.target.value as "active" | "inactive")
                            }
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInvestigators.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                      No investigators found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Cases */}
      {selectedInvestigator && (
        <InvestigatorCasesModal
          investigator={selectedInvestigator}
          cases={assignedCases} // filter them before passing
          onClose={() => setSelectedInvestigator(null)}
        />
      )}

      {/* Add Investigator Modal */}
      <AddInvestigatorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default InvestigatorsPage
