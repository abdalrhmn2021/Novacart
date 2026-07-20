"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1613]">
        <p className="font-body text-sm text-[#a9a196]">جارِ التحقق...</p>
      </div>
    );
  }

  return children;
}