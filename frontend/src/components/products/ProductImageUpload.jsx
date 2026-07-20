"use client";

import { useState } from "react";
import { uploadService } from "@/services/uploadService";

export default function ProductImageUpload({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const url = await uploadService.uploadImage(file);
      onChange(url);
    } catch (err) {
      setError("فشل رفع الصورة، حاول مرة أخرى");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {value && (
        <img
          src={value}
          alt="preview"
          className="mb-3 h-24 w-24 rounded-md object-cover border border-[#3a342c]"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="font-body text-xs text-[#a9a196] file:mr-3 file:rounded-md file:border-0 file:bg-[#c69749] file:px-3 file:py-1.5 file:text-[#1a1613] file:text-xs"
      />

      {uploading && (
        <p className="mt-1 font-body text-xs text-[#a9a196]">جاري الرفع...</p>
      )}
      {error && (
        <p className="mt-1 font-body text-xs text-[#c96a5a]">{error}</p>
      )}
    </div>
  );
}