// src/app/tasks/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";

interface Task {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
  aiMeta?: {
    suggestions?: {
      title: string;
      priority: string;
      reason: string;
    }[];
  };
}

export default function TaskDetailPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [suggesting, setSuggesting] = useState(false);

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

        setTask(data.task);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token && id) fetchTask();
  }, [token, id]);
  const fetchSuggestions = async () => {
    setSuggesting(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/v1/ai/tasks/${id}/suggest`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");

      // update UI with new suggestions
      setTask((prev) =>
        prev
          ? { ...prev, aiMeta: { suggestions: data.data.suggestions } }
          : null
      );
    } catch (err) {
      console.error("Suggestion fetch failed", err);
    } finally {
      setSuggesting(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading task...</p>;
  if (!task) return <p className="text-center mt-10">Task not found.</p>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
      <p className="text-gray-700 mb-2">
        {task.description || "No description."}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        Created on: {new Date(task.createdAt).toLocaleString()}
      </p>
      {task.aiMeta?.suggestions?.length ? (
        <div className="bg-gray-100 p-4 mt-4 rounded">
          <h3 className="font-semibold mb-2">AI Suggestions:</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
            {(task.aiMeta?.suggestions ?? []).map((sug, idx) => (
              <li key={idx}>
                <strong>{sug.title}</strong> ({sug.priority}) — {sug.reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-6">
        <h2 className="font-semibold text-lg mb-2">AI Suggestions:</h2>
        {suggesting ? (
          <p className="text-sm text-gray-600">Generating suggestions...</p>
        ) : task.aiMeta?.suggestions?.length ? (
          <ul className="list-disc pl-5 space-y-2 text-sm">
            {task.aiMeta.suggestions.map((sug, idx) => (
              <li key={idx}>
                <strong>{sug.title}</strong> ({sug.priority}) — {sug.reason}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 mb-2">No suggestions found.</p>
        )}

        <button
          onClick={fetchSuggestions}
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          disabled={suggesting}
        >
          {suggesting ? "Regenerating..." : "Regenerate Suggestions"}
        </button>
      </div>

      {editingId === task._id ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await fetch(`http://localhost:5000/api/v1/tasks/${task._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                title: editTitle,
                description: editDescription,
              }),
            });
            setEditingId(null); // hide form again
          }}
        >
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <button type="submit">Save</button>
        </form>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <button
            onClick={() => {
              setEditingId(task._id);
              setEditTitle(task.title);
              setEditDescription(task.description || "");
            }}
          >
            ✏️ Edit
          </button>
        </>
      )}
    </DashboardLayout>
  );
}
