"use client"

import { useState } from "react"
import { FiHelpCircle, FiMail, FiPhone, FiMessageCircle, FiBook, FiSearch } from "react-icons/fi"

const SupportPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const faqItems = [
    {
      id: 1,
      category: "cases",
      question: "How do I create a new case?",
      answer:
        "To create a new case, click the 'New Case' button on the dashboard or cases page. Fill in the required information including student details, case type, and description.",
    },
    {
      id: 2,
      category: "cases",
      question: "How can I update the status of a case?",
      answer:
        "Navigate to the specific case and click the status dropdown. Select the new status and add any relevant notes about the status change.",
    },
    {
      id: 3,
      category: "students",
      question: "How do I view a student's case history?",
      answer:
        "Go to the Students page and click on the student's name or use the view button. This will show their complete case history and risk assessment.",
    },
    {
      id: 4,
      category: "investigators",
      question: "How do I assign a case to an investigator?",
      answer:
        "When creating or editing a case, use the 'Assigned To' dropdown to select an available investigator. The system will notify them automatically.",
    },
    {
      id: 5,
      category: "settings",
      question: "How do I change notification preferences?",
      answer:
        "Go to Settings > Notifications and toggle the options for different types of alerts. Changes are saved automatically.",
    },
  ]

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "cases", label: "Cases" },
    { id: "students", label: "Students" },
    { id: "investigators", label: "Investigators" },
    { id: "settings", label: "Settings" },
  ]

  const filteredFAQs = faqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Support Center</h1>
          <p className="text-gray-600 mt-1">Get help and find answers to common questions</p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FiMail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 mb-4">Get help via email within 24 hours</p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Send Email
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FiPhone className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-gray-600 mb-4">Call us for immediate assistance</p>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Call Now
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FiMessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Chat with our support team</p>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              Start Chat
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <FiHelpCircle className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h2>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg">
                  <details className="group">
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                      <h3 className="text-sm font-medium text-gray-900">{faq.question}</h3>
                      <div className="ml-4 flex-shrink-0">
                        <div className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform">
                          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </summary>
                    <div className="px-4 pb-4">
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-8">
                <FiBook className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
                <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="#"
              className="flex items-center p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FiBook className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">User Manual</h4>
                <p className="text-sm text-gray-600">Complete guide to using the system</p>
              </div>
            </a>
            <a
              href="#"
              className="flex items-center p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <FiHelpCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Video Tutorials</h4>
                <p className="text-sm text-gray-600">Step-by-step video guides</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportPage
