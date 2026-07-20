"use client";

import { useState } from "react";
import { uploadService } from "@/services/uploadService";

export default function ProductGalleryUpload({ value = [], onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFilesChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    try {
      const uploadedUrls = await Promise.all(
        files.map((file) => uploadService.uploadImage(file)),
      );
      onChange([...value, ...uploadedUrls]);
    } catch (err) {
      setError("فشل رفع بعض الصور، حاول مرة أخرى");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      {value.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {value.map((url, i) => (
            <div key={`${url}-${i}`} className="relative">
              <img
                src={url}
                alt={`صورة ${i + 1}`}
                className="h-20 w-20 rounded-md border border-[#3a342c] object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#c96a5a] text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFilesChange}
        disabled={uploading}
        className="font-body text-xs text-[#a9a196] file:mr-3 file:rounded-md file:border-0 file:bg-[#c69749] file:px-3 file:py-1.5 file:text-xs file:text-[#1a1613]"
      />

      {uploading && (
        <p className="mt-1 font-body text-xs text-[#a9a196]">
          جاري رفع الصور...
        </p>
      )}
      {error && (
        <p className="mt-1 font-body text-xs text-[#c96a5a]">{error}</p>
      )}
    </div>
  );
}
