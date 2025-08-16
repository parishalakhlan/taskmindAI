// Dashboard Page
"use client";

import { Dashboard } from "@/components/layout/Dashboard";
import Layout from "@/components/Layout";
import { TaskProvider } from "@/context/TaskContext";
import React from "react";

export default function DashboardPage() {
  return (
    <>
      <Layout>
        <TaskProvider>
          {" "}
          <Dashboard />
        </TaskProvider>
      </Layout>
    </>
  );
}
