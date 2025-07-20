// Dashboard Page
"use client";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);
  if (!isAuthenticated) {
    return <p className="text-center mt-10">Redirecting to login...</p>;
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50 text-gray-800">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}!</h1>
      <p className="text-lg">This is your dashboard.</p>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
      <DashboardLayout>
        <div className="text-2xl">🎉 Welcome to your Dashboard!</div>
      </DashboardLayout>
    </main>
  );
}
