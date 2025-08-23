"use client"

import type React from "react"
import { useState } from "react"
import { FiMail, FiCheck, FiClock, FiX, FiEye } from "react-icons/fi"
import { emailService, type EmailNotification } from "../services/emailService"

interface EmailNotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const EmailNotificationPanel: React.FC<EmailNotificationPanelProps> = ({ isOpen, onClose }) => {
  const [notifications] = useState<EmailNotification[]>(emailService.getNotifications())
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null)

  if (!isOpen) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <FiCheck className="text-green-500" />
      case "pending":
        return <FiClock className="text-yellow-500" />
      case "failed":
        return <FiX className="text-red-500" />
      default:
        return <FiMail className="text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-50 text-green-700 border-green-200"
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "failed":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex">
        {/* Email List */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FiMail className="text-blue-500" />
              Email Notifications
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <FiX size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FiMail size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No email notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedEmail?.id === notification.id ? "bg-blue-50 border-r-2 border-blue-500" : ""
                    }`}
                    onClick={() => setSelectedEmail(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getStatusIcon(notification.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(notification.status)}`}
                          >
                            {notification.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.sentAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="font-medium text-sm text-gray-900 truncate">{notification.subject}</p>
                        <p className="text-xs text-gray-600 truncate">To: {notification.to}</p>
                        <p className="text-xs text-gray-500 mt-1">Case: {notification.caseId}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Email Preview */}
        <div className="w-1/2 flex flex-col">
          {selectedEmail ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FiEye className="text-gray-500" />
                  <span className="font-medium">Email Preview</span>
                </div>
                <h3 className="font-semibold text-gray-900">{selectedEmail.subject}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  To: {selectedEmail.to} | {new Date(selectedEmail.sentAt).toLocaleString()}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FiEye size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Select an email to preview</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
