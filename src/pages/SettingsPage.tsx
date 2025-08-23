"use client"

import { useState } from "react"
import { FiSave, FiBell, FiShield, FiUser, FiDatabase, FiMail } from "react-icons/fi"

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general")

  const tabs = [
    { id: "general", label: "General", icon: FiUser },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "security", label: "Security", icon: FiShield },
    { id: "database", label: "Database", icon: FiDatabase },
    { id: "email", label: "Email", icon: FiMail },
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your system preferences and configurations</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <tab.icon className="mr-3 h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {activeTab === "general" && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">General Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                      <input
                        type="text"
                        defaultValue="University Academic Integrity Office"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>UTC-5 (Eastern Time)</option>
                        <option>UTC-6 (Central Time)</option>
                        <option>UTC-7 (Mountain Time)</option>
                        <option>UTC-8 (Pacific Time)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Default Case Priority</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Medium</option>
                        <option>Low</option>
                        <option>High</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Settings</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">New Case Alerts</h4>
                        <p className="text-sm text-gray-500">Get notified when new cases are created</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Case Status Updates</h4>
                        <p className="text-sm text-gray-500">Receive updates when case status changes</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Weekly Reports</h4>
                        <p className="text-sm text-gray-500">Get weekly summary reports via email</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Security Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        defaultValue="30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Login Notifications</h4>
                        <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 rounded" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "database" && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Database Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Daily</option>
                        <option>Weekly</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Retention Period (months)
                      </label>
                      <input
                        type="number"
                        defaultValue="24"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "email" && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Email Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Server</label>
                      <input
                        type="text"
                        defaultValue="smtp.university.edu"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">From Email Address</label>
                      <input
                        type="email"
                        defaultValue="noreply@university.edu"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <FiSave className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
