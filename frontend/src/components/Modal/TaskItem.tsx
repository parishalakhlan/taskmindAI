import React from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, CheckCircle, Loader2 } from "lucide-react";
interface Task {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  completed?: boolean;
  priority?: "High" | "Medium" | "Low";
}

export const TaskItem = ({
  task,
  isEditing,
  editedTitle,
  onEditTitle,
  onStartEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  updating,
  deleting,
}: {
  task: Task;
  isEditing: boolean;
  editedTitle: string;
  onEditTitle: (title: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: () => void;
  onDelete: () => void;
  updating: boolean;
  deleting: boolean;
}) => {
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
            onChange={(e) => onEditTitle(e.target.value)}
            className="w-full text-base border-b border-rose-300 bg-transparent px-2 py-1 focus:outline-none focus:border-rose-500 transition-colors"
            placeholder="Edit task title..."
          />
          <div className="flex gap-2 mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onUpdate}
              disabled={updating}
              className={`flex-1 flex justify-center items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors shadow-md ${
                updating
                  ? "bg-gray-400 text-white"
                  : "bg-rose-500 text-white hover:bg-rose-600"
              }`}
            >
              {updating ? (
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
              onClick={onCancelEdit}
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
              // onClick={() => handleToggleComplete(task._id)}
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
              onClick={onStartEdit}
              className="p-2 rounded-full text-gray-400 hover:text-rose-500 transition-colors bg-white shadow-sm"
              title="Edit Task"
            >
              <Edit size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onDelete}
              disabled={deleting}
              className="p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors bg-white shadow-sm"
              title="Delete Task"
            >
              {deleting ? (
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
  // ... your existing JSX remains the same
};
