"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

interface Task {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
}

export default function TasksPage() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      console.log("fetchTasks called, token:", token); // ADD THIS
      try {
        console.log("Inside try block");
        if (!token) {
          console.log("No token available for fetching tasks");
          return;
        }
        const res = await fetch("http://localhost:5000/api/v1/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Full API response:", data);
        console.log("Tasks received:", data.data.tasks); // ✅ FIXED

        if (res.ok && data?.data?.tasks) {
          setTasks(data.data.tasks);
        } else {
          console.warn("No tasks found or bad format");
          setTasks([]); // explicitly clear
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTasks();
  }, [token]);
  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirm) return;

    setDeletingId(id); // mark this task as deleting

    try {
      const res = await fetch(`http://localhost:5000/api/v1/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");

      // Remove task from UI
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    } finally {
      setDeletingId(null); // reset deleting state
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4 text-blue-800">My Tasks</h1>

      {loading ? (
        <p className="text-green-600">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-yellow-800">No tasks found.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="bg-white p-4 shadow rounded border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-pink-600">
                {task.title}
              </h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-xs text-gray-400 text-orange-600">
                Created: {new Date(task.createdAt).toLocaleString()}
              </p>
              <button
                onClick={() => handleDelete(task._id)}
                disabled={deletingId === task._id}
                className="text-red-600 text-sm mt-2"
              >
                {deletingId === task._id ? "Deleting..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </DashboardLayout>
  );
}
