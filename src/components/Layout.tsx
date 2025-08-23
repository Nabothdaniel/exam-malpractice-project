"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom"
import {
  FiHome,
  FiFileText,
  FiUsers,
  FiShield,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiSearch,
  FiMail,
  FiMenu,
  FiX,
} from "react-icons/fi"
import { gsap } from "gsap"
import CreateCaseModal from "./CreateCaseModal"
import { EmailNotificationPanel } from "./EmailNotificationPanel"
import { useAuthStore } from "../store/authStore"
import { toast } from "react-toastify"

const sidebarItems = [
  { icon: FiHome, label: "Dashboard", path: "/" },
  { icon: FiFileText, label: "Cases", path: "/cases" },
  { icon: FiUsers, label: "Students", path: "/students" },
  { icon: FiShield, label: "Investigators", path: "/investigators" },
  { icon: FiSettings, label: "Settings", path: "/settings" },
  { icon: FiHelpCircle, label: "Support Center", path: "/support" },
]

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isEmailPanelOpen, setIsEmailPanelOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const { logout, userProfile, fetchUserProfile } = useAuthStore()

  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      await fetchUserProfile()
    }

    fetchProfile()
  }, [fetchUserProfile])

  const handleLogout = async () => {
    await logout()
    toast.success("Logged out successfully")

    setTimeout(() => {
      navigate("/login")
    }, 3000) // wait 3 seconds before redirect
  }

  useEffect(() => {
    // Animate sidebar items on load
    gsap.fromTo(
      ".sidebar-item",
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
    )
  }, [])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop & Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Logo + Close Button */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">EM</span>
            </div>
            <span className="font-semibold text-gray-900">ExamGuard</span>
          </div>
          {/* Close button for mobile */}
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.label} className="sidebar-item">
                <Link
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)} // close sidebar on mobile
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${location.pathname === item.path
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
            <li className="sidebar-item">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-600 hover:bg-gray-50"
              >
                <FiLogOut className="w-5 h-5" />
                <span className="font-medium">Log Out</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="m-3 flex flex-row items-center gap-2 md:hidden">
          <div>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
              <img src="/private-investigator.png" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
          <span className=" text-sm font-medium text-gray-700">{userProfile?.email || "User"}</span>
          
          </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500">v1.0.30 | Terms & Conditions</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between">
          {/* Left: Hamburger + Search */}
          <div className="flex items-center space-x-4 flex-1">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 rounded-md"
              onClick={() => setIsSidebarOpen(true)}
            >
              <FiMenu className="w-6 h-6" />
            </button>

            {/* Search bar - hidden on very small screens */}
            <div className="relative flex-1 max-w-md hidden sm:block">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search cases, students, or investigators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right: Icons + Profile */}
          <div className="flex items-center space-x-3 sm:space-x-4">

            <button
              onClick={() => setIsEmailPanelOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md relative"
              title="View Email Notifications"
            >
              <FiMail className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span>
            </button>
            <div className="hidden sm:block">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                <img src="/private-investigator.png" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">{userProfile?.name || "User"}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Modals & Panels */}
      <CreateCaseModal />
      <EmailNotificationPanel isOpen={isEmailPanelOpen} onClose={() => setIsEmailPanelOpen(false)} />
    </div>
  )
}

export default Layout
