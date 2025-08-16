"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function EditTaskPage() {
  const { token } = useAuth();
  const router = useRouter();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // 🔄 Fetch task details on page load
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch task");

        setTitle(data.task.title);
        setDescription(data.task.description || "");
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token && id) fetchTask();
  }, [token, id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch(`http://localhost:5000/api/v1/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      console.log("Task updated:", data);
      router.push("/tasks");
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading task...</p>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Edit Task</h1>
      <form
        onSubmit={handleUpdate}
        className="max-w-lg space-y-4 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block font-medium">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={updating}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {updating ? "Updating..." : "Update Task"}
        </button>
      </form>
    </DashboardLayout>
  );
}
