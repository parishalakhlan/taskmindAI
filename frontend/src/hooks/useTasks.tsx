"use client";

import { TodoPage } from "@/components/layout/Todo";
import { TaskItem } from "@/components/layout/Todo";
import Link from "next/link";

export const Hello = () => {
  const { task, loading } = TodoPage();

  // Calculate completed tasks
  const completedTasks = task.filter((task) => task.completed).length;
  const totalTasks = task.length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Main content area */}
      <div className="flex-1 flex flex-col p-4 lg:p-6 min-w-0">
        {/* ... (keep your header code) ... */}

        {/* Tasks section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-800">
              {completedTasks} task{completedTasks !== 1 ? "s" : ""} completed
              out of {totalTasks}
            </h3>
          </div>

          {loading ? (
            <div>Loading tasks...</div>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 3).map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  isEditing={false}
                  editedTitle=""
                  onEditTitle={() => {}}
                  onStartEdit={() => {}}
                  onCancelEdit={() => {}}
                  onUpdate={() => {}}
                  onDelete={() => {}}
                  updating={false}
                  deleting={false}
                />
              ))}
            </div>
          )}

          {tasks.length > 3 && (
            <div className="text-center mt-4">
              <Link
                href="/tasks"
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Show all tasks
              </Link>
            </div>
          )}
        </div>

        {/* ... (rest of your dashboard content) ... */}
      </div>
    </div>
  );
};
