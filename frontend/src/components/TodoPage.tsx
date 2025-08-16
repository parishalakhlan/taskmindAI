import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/context/TaskContext";
import { TaskItem } from "@/components/Modal/TaskItem";
import { AddEditModal } from "@/components/Modal/AddEditModal";

export const TodoPage = () => {
  const { token } = useAuth();
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleTaskCreated = (newTask: Task) => {
    toggleModal();
  };

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
              tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  isEditing={editingTaskId === task._id}
                  editedTitle={editingTaskId === task._id ? editedTitle : ""}
                  onEditTitle={setEditedTitle}
                  onStartEdit={() => {
                    setEditingTaskId(task._id);
                    setEditedTitle(task.title);
                  }}
                  onCancelEdit={() => {
                    setEditingTaskId(null);
                    setEditedTitle("");
                  }}
                  onUpdate={() => {
                    updateTask(task._id, { title: editedTitle });
                    setEditingTaskId(null);
                  }}
                  onDelete={() => deleteTask(task._id)}
                  updating={loading && editingTaskId === task._id}
                  deleting={loading}
                />
              ))
            )}
          </AnimatePresence>
        </main>
        <AddEditModal
          isOpen={isModalOpen}
          onClose={toggleModal}
          onTaskCreated={handleTaskCreated}
        />
      </div>
    </div>
  );
};
