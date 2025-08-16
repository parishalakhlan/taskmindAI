import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
interface Task {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  completed?: boolean;
  priority?: "High" | "Medium" | "Low";
}
interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (newTask: Task) => void;
}

export const AddEditModal = ({
  isOpen,
  onClose,
  onTaskCreated,
}: AddEditModalProps) => {
  const { createTask, getAISuggestions } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [includeAI, setIncludeAI] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<string[]>([]);
  const [suggesting, setSuggesting] = useState(false);

  const fetchAISuggestions = async () => {
    setSuggesting(true);
    try {
      const suggestions = await getAISuggestions(title);
      setAISuggestions(suggestions);
      if (suggestions.length > 0) {
        setDescription(suggestions.join("\n"));
      }
    } finally {
      setSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newTask = await createTask({
        title,
        description,
        priority: priority as "High" | "Medium" | "Low",
        deadline: deadline || undefined,
      });
      if (newTask) {
        onTaskCreated(newTask);
        resetForm();
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDeadline("");
    setAISuggestions([]);
    setIncludeAI(false);
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-6 md:p-8"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Add New Task
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="task-title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Task title
                </label>
                <input
                  type="text"
                  id="task-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Eat Ice-cream"
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="task-description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="task-description"
                  rows={3}
                  placeholder="Which flavor i wanna have today?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none transition-colors"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeAI}
                  onChange={(e) => {
                    setIncludeAI(e.target.checked);
                    if (e.target.checked && title) fetchAISuggestions();
                    else setAISuggestions([]);
                  }}
                />
                <label className="text-sm text-gray-700">
                  Include AI Suggestions
                </label>
              </div>

              {includeAI && (
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-semibold mb-2 text-sm text-gray-700">
                    AI Suggestions:
                  </h3>
                  {suggesting ? (
                    <p className="text-sm text-gray-600">Generating...</p>
                  ) : aiSuggestions.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800">
                      {aiSuggestions.map((sug, idx) => (
                        <li key={idx}>
                          <strong>{sug.title}</strong>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600">
                      {title ? "No suggestions found" : "Enter a title first"}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="task-priority"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Priority
                  </label>
                  <select
                    id="task-priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="task-deadline"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Deadline
                  </label>
                  <input
                    type="date"
                    id="task-deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row-reverse gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 disabled:bg-rose-400  transition-colors shadow-lg"
                >
                  {loading ? "Creating..." : "Save Task"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-full text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors shadow-md"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
  // ... rest of your modal JSX remains the same, just update the handlers to use the new functions
  // Make sure to update the form fields and suggestions display as needed
};
