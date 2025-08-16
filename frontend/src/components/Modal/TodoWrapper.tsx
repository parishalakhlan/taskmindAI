// components/TodoWrapper.tsx
import React from "react";
import { TaskProvider } from "@/context/TaskContext";

export const TodoWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <TaskProvider>{children}</TaskProvider>;
};
