"use client"

import { useState } from "react"
import { FiSearch, FiFilter, FiDownload, FiEye, FiEdit, FiPlus, FiUser, FiFileText } from "react-icons/fi"

const InvestigatorsPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock investigators data
  const investigators = [
    {
      id: "INV001",
      name: "Dr. Sarah Wilson",
      email: "sarah.wilson@university.edu",
      department: "Academic Integrity Office",
      specialization: "Cheating & Fraud",
      activeCases: 5,
      resolvedCases: 23,
      totalCases: 28,
      status: "active",
      joinDate: "2022-03-15",
      avatar: "/female-investigator.png",
    },
    {
      id: "INV002",
      name: "Prof. Mike Davis",
      email: "mike.davis@university.edu",
      department: "Computer Science",
      specialization: "Technical Violations",
      activeCases: 3,
      resolvedCases: 18,
      totalCases: 21,
      status: "active",
      joinDate: "2021-09-10",
      avatar: "/male-investigator.png",
    },
    {
      id: "INV003",
      name: "Dr. Emily Brown",
      email: "emily.brown@university.edu",
      department: "Student Affairs",
      specialization: "Identity Verification",
      activeCases: 2,
      resolvedCases: 15,
      totalCases: 17,
      status: "active",
      joinDate: "2023-01-20",
      avatar: "/female-investigator-2.png",
    },
    {
      id: "INV004",
      name: "Dr. James Wilson",
      email: "james.wilson@university.edu",
      department: "Academic Integrity Office",
      specialization: "Plagiarism Detection",
      activeCases: 0,
      resolvedCases: 12,
      totalCases: 12,
      status: "inactive",
      joinDate: "2020-05-08",
      avatar: "/investigator-male-2.png",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Active", className: "bg-green-100 text-green-800" },
      inactive: { label: "Inactive", className: "bg-gray-100 text-gray-800" },
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.active
  }

  const filteredInvestigators = investigators.filter((investigator) => {
    const matchesSearch =
      investigator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investigator.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investigator.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || investigator.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Investigators</h1>
              <p className="text-gray-600 mt-1">Manage investigation team and track their case assignments</p>
            </div>
            <div className="flex space-x-3">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <FiDownload className="w-4 h-4 mr-2" />
                Export Report
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <FiPlus className="w-4 h-4 mr-2" />
                Add Investigator
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <div className="p-2 bg-green-100 rounded-lg">
                <FiUser className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {investigators.filter((i) => i.status === "active").length}
                </p>
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
                  {investigators.reduce((sum, i) => sum + i.activeCases, 0)}
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
                  {investigators.reduce((sum, i) => sum + i.resolvedCases, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search investigators by name, ID, or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                <FiFilter className="w-4 h-4 mr-2" />
                Filter
              </button>
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
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvestigators.map((investigator) => (
                  <tr key={investigator.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={investigator.avatar || "/placeholder.svg"}
                          alt=""
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{investigator.name}</div>
                          <div className="text-sm text-gray-500">{investigator.email}</div>
                          <div className="text-sm text-gray-500">{investigator.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{investigator.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{investigator.specialization}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Total: {investigator.totalCases}</div>
                      <div className="text-sm text-gray-500">
                        Active: {investigator.activeCases} | Resolved: {investigator.resolvedCases}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(investigator.status).className}`}
                      >
                        {getStatusBadge(investigator.status).label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{investigator.joinDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <FiEdit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestigatorsPage
