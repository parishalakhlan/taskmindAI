// New Task Page
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Suggestion {
  title: string;
  priority: string;
  reason: string;
}
interface NewTaskFormProps {
  onTaskCreated: () => void;
  onCancel?: () => void;
}
export default function NewTaskPage({
  onTaskCreated,
  onCancel,
}: NewTaskFormProps) {
  const { token } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [includeAI, setIncludeAI] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<Suggestion[]>([]);
  const [suggesting, setSuggesting] = useState(false);
  const fetchAISuggestions = async () => {
    setSuggesting(true);
    try {
      const res = await fetch("http://localhost:5000/api/v1/ai/tasks/suggest", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setAISuggestions(data.data.suggestions || []);
    } catch (err) {
      console.error("Failed to fetch AI suggestions", err);
    } finally {
      setSuggesting(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/v1/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          includeAISuggestions: includeAI,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create task");
      setTitle("");
      setDescription("");
      setIncludeAI(false);
      setAISuggestions([]);
      onTaskCreated();
      console.log("Task created ✅", data);
    } catch (err) {
      console.error("Error creating task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg space-y-4 bg-white p-6 rounded shadow"
      >
        <div>
          <label className="block font-medium">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
            placeholder="e.g. Finish AI integration"
          />
        </div>

        <div>
          <label className="block font-medium">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
            placeholder="Optional"
            rows={4}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={includeAI}
            onChange={(e) => {
              setIncludeAI(e.target.checked);
              if (e.target.checked) fetchAISuggestions();
              else setAISuggestions([]);
            }}
          />
          <label>Include AI Suggestions</label>
        </div>
        {includeAI && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">AI Suggestions:</h3>
            {suggesting ? (
              <p className="text-sm text-gray-600">Generating...</p>
            ) : aiSuggestions.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
                {aiSuggestions.map((sug, idx) => (
                  <li key={idx}>
                    <strong>{sug.title}</strong> ({sug.priority}) — {sug.reason}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No suggestions found.</p>
            )}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>
    </DashboardLayout>
  );
}
