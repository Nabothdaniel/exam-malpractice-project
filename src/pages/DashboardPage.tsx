import { useEffect } from "react"
import { FiPlus } from "react-icons/fi"
import { gsap } from "gsap"
import { useCaseStore } from "../store/caseStore"
import CaseCards from "../components/CasesCards"
import { setPageTitle } from "@/utils/helperFunctions"

const DashboardPage = () => {
  useEffect(() => {
    setPageTitle("Dashboard")
  }, [])
  const { caseTypes, cases, recentUpdates, openCreateCaseModal, fetchCases, } = useCaseStore()

  useEffect(() => {
    fetchCases()
    gsap.fromTo(
      ".case-card",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, delay: 0.3, ease: "power2.out" },
    )
  }, [fetchCases])

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row  items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Case Management</h1>
            <p className="text-sm md:text-md text-gray-600 mt-1">
              Monitor and track exam malpractice cases and their progression
            </p>
          </div>
          <button
            onClick={openCreateCaseModal}
            className=" w-full md:w-auto justify-center flex items-center mt-5 md:mt-0 px-2 py-3 md:px-4 md:py-2 
             text-sm md:text-base 
             bg-blue-600 text-white rounded-md 
             hover:bg-blue-700 transition"
          >
            <FiPlus className="w-4 h-4 mr-1" />
            New Case
          </button>
        </div>

        {/* Case Types */}
        <CaseCards/>

        {/* Recent Updates  */}
        <div className="bg-white rounded-2xl border border-gray-200 mt-8 shadow-sm overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Case</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentUpdates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 italic">
                    No recent updates
                  </td>
                </tr>
              ) : (
                recentUpdates.map((update) => (
                  <tr key={update.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{update.case}</td>
                    <td className="px-6 py-4 text-gray-900">{update.student}</td>
                    <td className="px-6 py-4 text-gray-900">{update.action}</td>
                    <td className="px-6 py-4 text-gray-900">{update.level}</td>
                    <td className="px-6 py-4 text-gray-900">
                      {new Date(update.time).toLocaleString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                      })}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${update.status === "resolved"
                            ? "text-green-700 bg-green-100"
                            : update.status === "pending"
                              ? "text-yellow-700 bg-yellow-100"
                              : update.status === "investigating"
                                ? "text-blue-700 bg-blue-100"
                                : "text-gray-700 bg-gray-100"
                          }`}
                      >
                        {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                      </span>


                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>



      </div>
    </div>
  )
}

export default DashboardPage
