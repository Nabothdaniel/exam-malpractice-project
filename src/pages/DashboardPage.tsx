import { useEffect } from "react"
import { FiPlus, FiClock } from "react-icons/fi"
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Case Management</h1>
            <p className="text-sm md:text-md text-gray-600 mt-1">
              Monitor and track exam malpractice cases and their progression
            </p>
          </div>
          <button
            onClick={openCreateCaseModal}
            className="flex items-center px-3 py-1.5 md:px-4 md:py-2 
             text-sm md:text-base 
             bg-blue-600 text-white rounded-md 
             hover:bg-blue-700 transition"
          >
            <FiPlus className="w-4 h-4 mr-1" />
            New Case
          </button>
        </div>

        {/* Case Types */}
        <CaseCards caseTypes={caseTypes} cases={cases} />

        {/* Recent Updates (unchanged) */}
        <div className="bg-white rounded-lg border mt-8 border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <FiClock className="w-5 h-5" />
              <span>Recent Case Updates</span>
            </h2>
          </div>
          <div className="p-6">
            {recentUpdates.length === 0 ? (
              <p className="text-gray-500 text-center">No recent updates</p>
            ) : (
              <div className="space-y-4">
                {recentUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{update.case}</p>
                      <p className="text-sm text-gray-600">
                        {update.student} - {update.action}
                      </p>
                    </div>
                    <span className="inline-block px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border rounded-full">
                      {update.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
