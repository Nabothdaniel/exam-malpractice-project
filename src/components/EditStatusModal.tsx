import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { useCaseStore } from "../store/caseStore";

interface EditCaseModalProps {
  selectedCaseId: string;
  onClose: () => void;
}

const EditCaseModal: React.FC<EditCaseModalProps> = ({ selectedCaseId, onClose }) => {
  const { cases, updateCase } = useCaseStore();
  const selectedCase = cases.find((c) => c.id === selectedCaseId);

  const [formData, setFormData] = useState({
    studentName: "",
    matricNumber: "",
    studentEmail: "",
    department: "",
    level: "",
    caseType: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    assignedInvestigator: "",
    status: "active" as "active" | "pending" | "resolved" | "investigating",
    media: null as File | null, // only new uploads
  });

  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const investigators = ["Dr. Sarah Wilson", "Prof. Mike Davis", "Dr. Emily Brown", "Dr. James Wilson"];

  // Pre-fill form data when modal opens
  useEffect(() => {
    if (!selectedCase) return;

    setFormData({
      studentName: selectedCase.studentName,
      matricNumber: selectedCase.matricNumber,
      studentEmail: selectedCase.studentEmail,
      department: selectedCase.department,
      level: selectedCase.level || "",
      caseType: selectedCase.caseType,
      description: selectedCase.description,
      priority: selectedCase.priority,
      assignedInvestigator: selectedCase.assignedInvestigator,
      status: selectedCase.status,
      media: null, // keep null because existing media is already stored
    });

    setMediaPreview(selectedCase.media || null);
  }, [selectedCase]);

  if (!selectedCase) return null;

  const handleInputChange = (field: string, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "media") {
      if (value instanceof File) {
        setMediaPreview(URL.createObjectURL(value));
      } else if (typeof value === "string") {
        setMediaPreview(value);
      } else {
        setMediaPreview(null);
      }
    }
  };

  const handleSave = async () => {
    if (!selectedCase) return;
    setLoading(true);

    const updates = {
      studentName: formData.studentName,
      matricNumber: formData.matricNumber,
      studentEmail: formData.studentEmail,
      department: formData.department,
      level: formData.level,
      caseType: formData.caseType,
      description: formData.description,
      priority: formData.priority,
      assignedInvestigator: formData.assignedInvestigator,
      status: formData.status,
      media: formData.media instanceof File ? formData.media : null,
    };

    try {
        console.log(selectedCase.id)
      await updateCase(selectedCase.id, updates);
      toast.success("Case updated successfully ✅");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update case ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Case</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Student Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Student Name"
              value={formData.studentName}
              onChange={(e) => handleInputChange("studentName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Matric Number"
              value={formData.matricNumber}
              onChange={(e) => handleInputChange("matricNumber", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.studentEmail}
              onChange={(e) => handleInputChange("studentEmail", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Department"
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              placeholder="Level"
              value={formData.level}
              onChange={(e) => handleInputChange("level", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Case Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Case Type"
              value={formData.caseType}
              onChange={(e) => handleInputChange("caseType", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange("priority", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={formData.assignedInvestigator}
              onChange={(e) => handleInputChange("assignedInvestigator", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Auto-assign</option>
              {investigators.map((inv) => (
                <option key={inv} value={inv}>
                  {inv}
                </option>
              ))}
            </select>

            {/* Status field */}
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="active">Active</option>
              <option value="investigating">Investigating</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>

            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              placeholder="Description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none md:col-span-2"
            />

            {/* Media upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Media</label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleInputChange("media", e.target.files?.[0] || null)}
                className="w-full"
              />
              {mediaPreview && (
                <div className="mt-2">
                  {mediaPreview.match(/\.(mp4|mov)$/) ? (
                    <video src={mediaPreview} className="w-64 h-36 rounded-md" controls />
                  ) : (
                    <img src={mediaPreview} alt="preview" className="w-32 h-32 object-cover rounded-md" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center p-6 border-t border-gray-200 space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-md">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCaseModal;
