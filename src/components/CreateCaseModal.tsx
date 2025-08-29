
import type React from "react"
import { useEffect, useState } from "react"
import { FiX, FiUser, FiFileText, FiAlertTriangle, FiCamera, FiMail, FiHash } from "react-icons/fi"
import { useCaseStore } from "../store/caseStore"
import { toast } from "react-toastify"
import { useInvestigatorsStore } from "@/store/investigatorStore"
import type { NewCase } from "@/types"

const CreateCaseModal = () => {
  const { isCreateCaseModalOpen, closeCreateCaseModal, addCase, caseTypes } = useCaseStore()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<NewCase>({
  studentName: "",
  matricNumber: "",
  studentEmail: "",
  department: "",
  program: "",
  level: "",
  gender: "male", // must initialize with one of the allowed union values
  caseType: "",
  description: "",
  priority: "medium",
  assignedInvestigator: "",
  media: null,
  riskLevel: "low",
});

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { investigators, fetchInvestigators } = useInvestigatorsStore()

  useEffect(() => {
    fetchInvestigators()
  }, [])

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}
    if (currentStep === 1) {
      if (!formData.studentName.trim()) newErrors.studentName = "Student name is required"
      if (!formData.matricNumber.trim()) newErrors.matricNumber = "Matric/Registration number is required"
      if (!formData.studentEmail.trim()) newErrors.studentEmail = "Student email is required"
      else if (!/\S+@\S+\.\S+/.test(formData.studentEmail)) newErrors.studentEmail = "Invalid email address"
      if (!formData.department.trim()) newErrors.department = "Department is required"
      if (!formData.level.trim()) newErrors.level = "Department is required"
    }
    if (currentStep === 2) {
      if (!formData.caseType) newErrors.caseType = "Case type is required"
      if (!formData.description.trim()) newErrors.description = "Description is required"
      if (formData.description.trim().length < 10) newErrors.description = "Description must be at least 10 characters"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) setStep(step + 1)
  }

  const handlePrevious = () => setStep(step - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(2)) return

    try {
      setLoading(true)
      await addCase(formData)

      //reset form data
      setFormData({
        studentName: "",
        matricNumber: "",
        studentEmail: "",
        department: "",
        level: "",
        program: "",
         gender: "" as "male" | "female",
        caseType: "",
        description: "",
        priority: "medium",
        assignedInvestigator: "",
        media: null,
        riskLevel: "low", // Reset riskLevel as well
      })
      setMediaPreview(null)
      setErrors({})
      setStep(1)
      closeCreateCaseModal()

      // Show toast
      toast.success("Case created successfully ✅")
    } catch (err) {
      toast.error("Failed to create case ❌")
    } finally {
      setLoading(false)
    }
  }
  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
    if (field === "media" && value instanceof File) setMediaPreview(URL.createObjectURL(value))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600"
      case "medium": return "text-yellow-600"
      case "low": return "text-green-600"
      default: return "text-gray-600"
    }
  }

  if (!isCreateCaseModalOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiFileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create New Case</h2>
              <p className="text-sm text-gray-600">Add a new exam malpractice case to the system</p>
            </div>
          </div>
          <button
            onClick={closeCreateCaseModal}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-auto p-6 space-y-6">
          {/* Step 1 */}
          {/* Step 1 */}
          {step === 1 && (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiUser className="w-5 h-5 mr-2" /> Student Information
              </h3>
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => handleInputChange("studentName", e.target.value)}
                    placeholder="Enter student's full name"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.studentName ? "border-red-300" : "border-gray-300"}`}
                  />
                  {errors.studentName && <p className="mt-1 text-sm text-red-600">{errors.studentName}</p>}
                </div>

                {/* Matric Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:flex items-center">
                    <FiHash className="w-4 h-4 mr-1" /> Matric/Reg Number *
                  </label>
                  <input
                    type="text"
                    value={formData.matricNumber}
                    onChange={(e) => handleInputChange("matricNumber", e.target.value)}
                    placeholder="Enter registration number"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.matricNumber ? "border-red-300" : "border-gray-300"}`}
                  />
                  {errors.matricNumber && <p className="mt-1 text-sm text-red-600">{errors.matricNumber}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:flex items-center">
                    <FiMail className="w-4 h-4 mr-1" /> Active Email *
                  </label>
                  <input
                    type="email"
                    value={formData.studentEmail}
                    onChange={(e) => handleInputChange("studentEmail", e.target.value)}
                    placeholder="Enter student's active email"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.studentEmail ? "border-red-300" : "border-gray-300"}`}
                  />
                  {errors.studentEmail && <p className="mt-1 text-sm text-red-600">{errors.studentEmail}</p>}
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    placeholder="Enter student's department"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.department ? "border-red-300" : "border-gray-300"}`}
                  />
                  {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
                </div>

                {/* Program */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program *</label>
                  <input
                    type="text"
                    value={formData.program}
                    onChange={(e) => handleInputChange("program", e.target.value)}
                    placeholder="Enter student's program (e.g., BSc Computer Science)"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.program ? "border-red-300" : "border-gray-300"}`}
                  />
                  {errors.program && <p className="mt-1 text-sm text-red-600">{errors.program}</p>}
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                  <input
                    type="text"
                    value={formData.level}
                    onChange={(e) => handleInputChange("level", e.target.value)}
                    placeholder="Enter student's level"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.level ? "border-red-300" : "border-gray-300"}`}
                  />
                  {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>  handleInputChange("gender", e.target.value as "male" | "female" | "other")}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.gender ? "border-red-300" : "border-gray-300"}`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                </div>
              </div>
            </>
          )}


          {/* Step 2 */}
          {step === 2 && (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FiFileText className="w-5 h-5 mr-2" /> Case Details
              </h3>
              <div className="space-y-4">
                {/* Case Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Case Type *</label>
                  <select
                    value={formData.caseType}
                    onChange={(e) => handleInputChange("caseType", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.caseType ? "border-red-300" : "border-gray-300"}`}
                  >
                    <option value="">Select case type</option>
                    {caseTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.title}</option>
                    ))}
                  </select>
                  {errors.caseType && <p className="mt-1 text-sm text-red-600">{errors.caseType}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Provide detailed description of the incident..."
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.description ? "border-red-300" : "border-gray-300"}`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                  <p className="mt-1 text-sm text-gray-500">{formData.description.length}/500 characters</p>
                </div>

                {/* Priority, Investigator, Media */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange("priority", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                    <div className="mt-1 flex items-center">
                      <FiAlertTriangle className={`w-4 h-4 mr-1 ${getPriorityColor(formData.priority)}`} />
                      <span className={`text-sm ${getPriorityColor(formData.priority)}`}>
                        {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign Investigator</label>
                    <select
                      value={formData.assignedInvestigator}
                      onChange={(e) => handleInputChange("assignedInvestigator", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Auto-assign</option>
                      {investigators.map((inv) => (
                        <option key={inv.id} value={inv.name}>
                          {inv.name} — {inv.department}
                        </option>
                      ))}
                    </select>

                    <p className="mt-1 text-sm text-gray-500">Leave empty for automatic assignment</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:flex items-center">
                      <FiCamera className="w-5 h-5 mr-2" /> Upload Evidence
                    </label>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => handleInputChange("media", e.target.files?.[0] || null)}
                      className="w-full"
                    />
                    {mediaPreview && formData.media && (
                      <div className="mt-2">
                        {formData.media.type.startsWith("image/") ? (
                          <img src={mediaPreview} alt="preview" className="w-32 h-32 object-cover rounded-md" />
                        ) : (
                          <video src={mediaPreview} className="w-64 h-36 rounded-md" controls />
                        )}
                      </div>
                    )}
                    <p className="mt-1 text-sm text-gray-500">Attach either a photo or video as evidence.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Previous
              </button>
            )}
            <button
              type={step === 2 ? "submit" : "button"}
              onClick={step === 1 ? handleNext : undefined}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : step === 2 ? (
                "Submit Case"
              ) : (
                "Next"
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCaseModal
