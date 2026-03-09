import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

// Types
interface Task {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  completed?: boolean;
  priority?: "High" | "Medium" | "Low";
  deadline?: string; // Or this, choose one naming convention
}

interface Suggestion {
  title: string;
}

interface CreateTaskData {
  title: string;
  description?: string;
  priority?: "High" | "Medium" | "Low";
  deadline?: string;
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  priority?: "High" | "Medium" | "Low";
  deadline?: string;
  completed?: boolean;
  updatedAt?: string;
}

// Context Type
interface TaskContextType {
  // State
  tasks: Task[];
  loading: boolean;
  deletingId: string | null;
  editingTaskId: string | null;
  editedTitle: string;
  updating: boolean;
  formatDate: (dateString?: string) => string;
  // Actions
  fetchTasks: () => Promise<void>;
  createTask: (taskData: CreateTaskData) => Promise<Task | null>;
  updateTask: (id: string, updates: UpdateTaskData) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTaskComplete: (id: string) => Promise<boolean>;
  fetchAISuggestions: (title: string) => Promise<Suggestion[]>;

  // Edit state management
  startEditing: (taskId: string, currentTitle: string) => void;
  cancelEditing: () => void;
  setEditedTitle: (title: string) => void;

  // Utility
  refreshTasks: () => Promise<void>;
}

// Create Context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Provider Props
interface TaskProviderProps {
  children: ReactNode;
}
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_PUBLIC_URL;
// Task Provider Component
export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const { token } = useAuth();

  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [updating, setUpdating] = useState(false);
  // Add this helper function in your TaskProvider component
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "No deadline";

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };
  // Fetch Tasks
  const fetchTasks = useCallback(async (): Promise<void> => {
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/v1/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      if (res.ok && data?.data?.tasks) {
        setTasks(data.data.tasks);
      } else {
        console.warn("No tasks found or bad format");
        setTasks([]);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      toast.error("Failed to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Create Task
  const createTask = async (taskData: CreateTaskData): Promise<Task | null> => {
    if (!token) return null;

    if (!taskData.title.trim()) {
      toast.error("Title is required");
      return null;
    }

    try {
      const res = await fetch(`${backendUrl}/api/v1/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority || "Medium",
          deadline: taskData.deadline || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create task");

      const newTask = data.data.task;
      setTasks((prevTasks) => [newTask, ...prevTasks]);

      toast.success("Task created successfully!", {
        position: "top-right",
        duration: 4000,
      });

      return newTask;
    } catch (err: unknown) {
      console.error("Error creating task:", err);
      toast.error(err instanceof Error ? err.message : "Failed to create task");
      return null;
    }
  };

  // Update Task
  const updateTask = async (
    id: string,
    updates: UpdateTaskData,
  ): Promise<boolean> => {
    if (!token) return false;

    setUpdating(true);
    try {
      const res = await fetch(`${backendUrl}/api/v1/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...updates,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id
            ? {
                ...task,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : task,
        ),
      );

      toast.success("Task updated successfully");
      return true;
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Failed to update task");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  // Delete Task
  const deleteTask = async (id: string): Promise<boolean> => {
    if (!token) return false;

    setDeletingId(id);
    try {
      const res = await fetch(`${backendUrl}/api/v1/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");

      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));

      return true;
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task");
      return false;
    } finally {
      setDeletingId(null);
    }
  };

  // Toggle Task Complete
  // In your TaskContext.tsx
  const toggleTaskComplete = async (id: string): Promise<boolean> => {
    console.log("1. Starting toggle for task:", id);

    // Store original state for rollback
    const originalTasks = tasks;

    // Optimistic UI update FIRST
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null,
            }
          : task,
      ),
    );

    try {
      console.log(
        "2. Making API call to:",
        `http://localhost:5000/api/v1/tasks/${id}/toggle-completion`,
      );
      const res = await fetch(
        `${backendUrl}/api/v1/tasks/${id}/toggle-completion`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("3. API response status:", res.status);

      if (!res.ok) {
        throw new Error(`Toggle failed with status: ${res.status}`);
      }

      const data = await res.json();
      console.log("4. API response data:", data);

      // Update with server response to ensure consistency
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === id ? { ...task, ...data.data.task } : task,
        ),
      );

      return true;
    } catch (err) {
      console.error("Error toggling task completion:", err);

      // Rollback optimistic update on failure
      setTasks(originalTasks);
      return false;
    }
  };
  // Fetch AI Suggestions
  const fetchAISuggestions = async (title: string): Promise<Suggestion[]> => {
    if (!token || !title.trim()) return [];

    try {
      const res = await fetch(`${backendUrl}/api/v1/tasks/suggest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();
      const suggestions = data.data;

      if (Array.isArray(suggestions) && suggestions.length > 0) {
        return suggestions;
      } else {
        console.warn("❌ No suggestions returned or response not an array.");
        return [];
      }
    } catch (err) {
      console.error("Failed to fetch AI suggestions", err);
      return [];
    }
  };

  // Edit state management
  const startEditing = (taskId: string, currentTitle: string): void => {
    setEditingTaskId(taskId);
    setEditedTitle(currentTitle);
  };

  const cancelEditing = (): void => {
    setEditingTaskId(null);
    setEditedTitle("");
  };

  // Refresh tasks (alias for fetchTasks for clearer intent)
  const refreshTasks = async (): Promise<void> => {
    await fetchTasks();
  };

  // Initial fetch on mount
  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token, fetchTasks]);

  // Context value
  const contextValue: TaskContextType = {
    // State
    tasks,
    loading,
    deletingId,
    editingTaskId,
    editedTitle,
    updating,

    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    fetchAISuggestions,

    // Edit state management
    startEditing,
    cancelEditing,
    setEditedTitle,

    // Utility
    refreshTasks,
    formatDate,
  };

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};

// Custom hook to use Task Context
export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);

  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }

  return context;
};

// Export types for use in other components
export type { Task, Suggestion, CreateTaskData, UpdateTaskData };
