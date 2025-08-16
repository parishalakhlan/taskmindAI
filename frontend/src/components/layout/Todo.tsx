import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, CheckCircle, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { useTask, Task, Suggestion } from "@/context/TaskContext";

// TaskItem component using context
export const TaskItem = ({ task }: { task: Task }) => {
  const {
    editingTaskId,

    formatDate,
    editedTitle,
    updating,
    deletingId,
    startEditing,
    cancelEditing,
    setEditedTitle,
    updateTask,
    deleteTask,
    toggleTaskComplete,
  } = useTask();

  const isEditing = editingTaskId === task._id;
  const isUpdating = updating && editingTaskId === task._id;
  const isDeleting = deletingId === task._id;

  const handleUpdate = async () => {
    if (!editedTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    const success = await updateTask(task._id, { title: editedTitle });
    if (success) {
      cancelEditing();
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    await deleteTask(task._id);
  };

  // In your task component where you have the check circle
  const handleToggleComplete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Component: handleToggleComplete called for task:", task._id);

    // IMPORTANT: Don't do any state updates here, let context handle everything
    await toggleTaskComplete(task._id);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 rounded-2xl transition-all duration-300 shadow-lg border ${
        task.completed
          ? "bg-stone-50 border-stone-200 text-stone-400"
          : "bg-white border-gray-200 hover:shadow-xl"
      }`}
    >
      {isEditing ? (
        <div className="flex-1 w-full space-y-3">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full text-base border-b border-rose-300 bg-transparent px-2 py-1 focus:outline-none focus:border-rose-500 transition-colors"
            placeholder="Edit task title..."
          />
          <div className="flex gap-2 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpdate}
              disabled={isUpdating}
              className={`flex-1 flex justify-center items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-md ${
                isUpdating
                  ? "bg-gray-400 text-white"
                  : "bg-rose-500 text-white hover:bg-rose-600"
              }`}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={cancelEditing}
              className="flex-1 flex justify-center text-sm font-medium bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300 transition-colors shadow-md"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start space-x-3 sm:space-x-4 flex-1 w-full">
            <motion.div
              className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors mt-1 ${
                task.completed
                  ? "bg-rose-500 text-white"
                  : "border-2 border-gray-300 text-transparent hover:bg-gray-200"
              }`}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleComplete}
            >
              {task.completed && <CheckCircle size={16} />}
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-sm sm:text-lg tracking-tight ${
                  task.completed
                    ? "line-through text-gray-400"
                    : "text-gray-900"
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  className={`text-xs sm:text-sm text-gray-500 mt-1 break-words line-clamp-2 ${
                    task.completed ? "line-through" : ""
                  }`}
                >
                  {task.description}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2 opacity-70">
                {task.updatedAt
                  ? `Updated: ${new Date(task.updatedAt).toLocaleString()}`
                  : `Created: ${new Date(task.createdAt).toLocaleString()}`}
              </p>
              <p>Due: {formatDate(task.deadline)}</p>
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center space-x-2 sm:space-x-4 mt-4 sm:mt-0 ml-auto sm:ml-4">
            <span
              className={`hidden md:inline-flex px-3 py-1 text-xs font-medium rounded-full shadow-inner ${
                task.priority === "High"
                  ? "bg-red-50 text-red-700"
                  : task.priority === "Medium"
                  ? "bg-yellow-50 text-yellow-700"
                  : "bg-green-50 text-green-700"
              }`}
            >
              {task.priority}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => startEditing(task._id, task.title)}
              className="p-2 rounded-full text-gray-400 hover:text-rose-500 transition-colors bg-white shadow-sm"
              title="Edit Task"
            >
              <Edit size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors bg-white shadow-sm"
              title="Delete Task"
            >
              {isDeleting ? (
                <Loader2 className="animate-spin text-red-500" size={16} />
              ) : (
                <Trash2 size={16} />
              )}
            </motion.button>
          </div>
        </>
      )}
    </motion.div>
  );
};

// AddEditModal component using context
interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddEditModal = ({ isOpen, onClose }: AddEditModalProps) => {
  const { createTask, fetchAISuggestions } = useTask();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);
  const [includeAI, setIncludeAI] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<Suggestion[]>([]);
  const [suggesting, setSuggesting] = useState(false);

  const handleFetchAISuggestions = async () => {
    if (!title.trim()) return;

    setSuggesting(true);
    try {
      const suggestions = await fetchAISuggestions(title);

      if (suggestions.length > 0) {
        const combined = suggestions
          .map((s, i) => `${i + 1}. ${s.title}`)
          .join("\n");
        setDescription(combined);
        setAISuggestions(suggestions);
      } else {
        console.warn("❌ No suggestions returned or response not an array.");
      }
    } catch (err) {
      console.error("Failed to fetch AI suggestions", err);
    } finally {
      setSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const task = await createTask({
      title,
      description,
      priority,
      deadline: deadline || undefined,
    });

    if (task) {
      // Reset form and close modal
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setDeadline("");
      setAISuggestions([]);
      setIncludeAI(false);
      onClose();
    }

    setLoading(false);
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
                    if (e.target.checked && title) {
                      handleFetchAISuggestions();
                    } else {
                      setAISuggestions([]);
                    }
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
};

// Main TodoPage component using context
export const TodoPage = () => {
  const { tasks, loading } = useTask();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 p-4 sm:p-6 bg-white rounded-3xl shadow-xl">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Todo
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleModal}
            className="flex items-center space-x-2 px-4 py-2 sm:px-6 sm:py-3 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 transition-all duration-200 text-sm sm:text-base"
          >
            <Plus size={20} />
            <span className="hidden sm:inline font-semibold">Add Task</span>
          </motion.button>
        </header>

        <main className="space-y-4">
          <AnimatePresence>
            {loading ? (
              <motion.p
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 text-gray-500 flex items-center justify-center gap-2 text-lg"
              >
                <Loader2 className="animate-spin" size={24} />
                Loading tasks...
              </motion.p>
            ) : tasks.length === 0 ? (
              <motion.div
                key="no-tasks"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200"
              >
                <p className="text-gray-500 text-lg">
                  No tasks found. Get started by adding a new one!
                </p>
              </motion.div>
            ) : (
              tasks.map((task) => <TaskItem key={task._id} task={task} />)
            )}
          </AnimatePresence>
        </main>

        <AddEditModal isOpen={isModalOpen} onClose={toggleModal} />
      </div>
    </div>
  );
};
