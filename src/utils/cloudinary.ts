// utils/cloudinary.ts
import axios from "axios";

const cloudName = "dkwtlbksi";
const uploadPreset = "user_profile_upload";
const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await axios.post(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed:", err);
    throw err;
  }
};
