"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import React, { useState } from "react";
import { useTask } from "@/context/TaskContext";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UserCircle,
  ClipboardList,
  Mail,
  Star,
  X,
  CheckCircle2,
  Activity,
  Menu,
  User2Icon,
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { tasks } = useTask();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const router = useRouter();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <p className="text-center mt-10">Redirecting to login...</p>;
  }
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 150,
        damping: 15,
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
    hover: {
      scale: 1.02,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 10,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  // Get current week days (Sunday to Saturday)
  const getCurrentWeekDays = () => {
    const days = [];
    const today = new Date();
    const currentDay = today.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Start from Sunday of current week
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - currentDay);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }

    return days;
  };
  // Variants for parent container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  // Variants for individual chart bars
  // Update the barVariants to use proper types
  const barVariants = {
    hidden: { height: 0 },
    visible: {
      height: "100%", // Use fixed value instead of CSS variable
      transition: {
        duration: 0.8,
        ease: "easeOut" as const, // Add type assertion
      },
    },
  };

  const doughnutVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };
  // Fixed function to get local date string (YYYY-MM-DD format)
  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Group tasks by day
  const groupTasksByDay = () => {
    const weekDays = getCurrentWeekDays();

    console.log(
      "Week days:",
      weekDays.map((d) => getLocalDateString(d))
    ); // Debug log
    console.log(
      "Tasks with dates:",
      tasks.map((t) => ({
        id: t._id,
        createdAt: t.createdAt,
        localDate: getLocalDateString(new Date(t.createdAt)),
      }))
    ); // Debug log

    return weekDays.map((day) => {
      const dayString = getLocalDateString(day);
      const tasksForDay = tasks.filter((task) => {
        const taskDate = getLocalDateString(new Date(task.createdAt));
        return taskDate === dayString;
      });

      return {
        date: day,
        dayName: day.toLocaleDateString("en-US", { weekday: "short" }),
        taskCount: tasksForDay.length,
        tasksForDay: tasksForDay, // Add this for debugging
        isToday: day.toDateString() === new Date().toDateString(),
      };
    });
  };

  const weekDaysWithTasks = groupTasksByDay();
  /*
  const ProgressChart = ({ percent }: { percent: number }) => {
    const [hoveredSection, setHoveredSection] = useState<
      "completed" | "undone" | null
    >(null);

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffsetCompleted =
      circumference - (percent / 100) * circumference;

    return (
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />

          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#ef4444"
            strokeWidth="10"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={0}
            transform="rotate(-90 50 50)"
            opacity={
              hoveredSection === "completed"
                ? 0.5
                : hoveredSection === "undone"
                ? 1
                : 1
            }
            onMouseEnter={() => setHoveredSection("undone")}
            onMouseLeave={() => setHoveredSection(null)}
            className="transition-opacity duration-200 cursor-pointer"
          />

          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="10"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffsetCompleted}
            transform="rotate(-90 50 50)"
            opacity={
              hoveredSection === "undone"
                ? 0.5
                : hoveredSection === "completed"
                ? 1
                : 1
            }
            onMouseEnter={() => setHoveredSection("completed")}
            onMouseLeave={() => setHoveredSection(null)}
            className="transition-opacity duration-200 cursor-pointer"
          />

          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-lg font-medium fill-gray-700"
          >
            {hoveredSection === "completed" && `${percent}%`}
            {hoveredSection === "undone" && `${100 - percent}%`}
            {!hoveredSection && `${percent}%`}
          </text>
        </svg>

        {hoveredSection && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white shadow-md rounded px-2 py-1 text-xs whitespace-nowrap">
            {hoveredSection === "completed" ? "Completed" : "Undone"}:{" "}
            {hoveredSection === "completed" ? percent : 100 - percent}%
          </div>
        )}
      </div>
    );
  }; */
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: {
      scale: 1.08,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    }, // Tailwind shadow-lg equivalent
    tap: { scale: 0.95 },
  };

  interface SidebarItem {
    name: string;
    icon: React.ElementType; // The icon is a React component
    notifications: number;
    current: boolean;
    link: string;
  }

  const sidebarItems: SidebarItem[] = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      notifications: 0,
      current: true,
      link: "#",
    },
    {
      name: "Tasks",
      icon: ClipboardList,
      notifications: tasks.filter((task) => !task.completed).length,
      current: false,
      link: "/tasks",
    },

    {
      name: "Profile",
      icon: User2Icon,
      notifications: 0,
      current: false,
      link: "/profile",
    },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-56 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 lg:w-64 lg:shadow-none`}
      >
        <div className="p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <CheckCircle2 className="mr-2 text-blue-500" size={20} />
            <span className="hidden sm:inline">Task Mind</span>
            <span className="inline sm:hidden">TM</span>
          </h2>
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700 p-1"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col p-4 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={item.link}
                className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  item.current
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <item.icon size={16} className="mr-3 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
                {item.notifications > 0 && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-red-500 text-white">
                    {item.notifications}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 lg:p-6 min-w-0">
        <header className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3 mb-4 lg:hidden">
          <button
            className="text-gray-500 hover:text-gray-700 p-1"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <h2 className="text-lg font-bold text-gray-900 truncate flex-1 text-center">
            Dashboard
          </h2>
        </header>
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl border border-gray-200 bg-white w-full cursor-pointer relative overflow-hidden group hover:shadow-md transition-shadow"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
        >
          {/* Animated Avatar Container */}
          <motion.div
            className="relative w-14 h-14 rounded-full flex items-center justify-center shrink-0"
            variants={contentVariants}
            whileHover={{
              rotate: [0, 5, -5, 0],
              transition: { duration: 0.6 },
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 animate-gradient-shift bg-300%"></div>
            <UserCircle className="w-10 h-10 text-white/90 z-10" />
          </motion.div>

          {/* User Info Content - Improved for all screens */}
          <div className="flex-1 min-w-0 space-y-2">
            <motion.div
              className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3"
              variants={contentVariants}
            >
              <div className="flex items-center gap-2">
                <p className="font-bold text-gray-900 text-lg sm:text-xl truncate">
                  Welcome,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    {user?.name || "User"}
                  </span>
                </p>
                <motion.span
                  className="text-xl hidden sm:block"
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  👋
                </motion.span>
              </div>

              {/* Mobile-only wave emoji */}
              <motion.span
                className="text-xl sm:hidden self-start"
                animate={{
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                👋
              </motion.span>
            </motion.div>

            {/* Email with better wrapping */}
            <motion.div
              className="flex items-center gap-2 text-sm text-gray-600"
              variants={contentVariants}
            >
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <p className="truncate sm:whitespace-normal sm:break-all">
                {user?.email || "user@example.com"}
              </p>
            </motion.div>

            {/* Status badge with animation */}
            <motion.div
              className="flex gap-2 flex-wrap"
              variants={contentVariants}
              whileHover={{
                scale: 1.02,
                transition: { type: "spring", stiffness: 400 },
              }}
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                <Activity className="w-3 h-3 mr-1.5 animate-pulse" />
                Active now
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors">
                <Star className="w-3 h-3 mr-1.5" />
                Pro Member
              </span>
            </motion.div>
          </div>

          {/* Hover effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </motion.div>
        <motion.div
          className="p-4 md:p-8 bg-white text-gray-900 rounded-xl md:rounded-2xl shadow-lg border border-gray-200 font-inter w-full overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header section with title and date */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 md:pb-6 border-b border-gray-200 mb-6">
            <motion.h2
              className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 sm:mb-0 text-gray-800"
              variants={itemVariants}
            >
              Task Completion Trend
            </motion.h2>
            <motion.div
              className="text-sm text-gray-600 font-medium"
              variants={itemVariants}
            >
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </motion.div>
          </div>

          {/* Main content with charts - Added gap and motion */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            {/* Bar chart column */}
            <motion.div
              className="lg:col-span-2"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  },
                },
              }}
            >
              <div className="relative h-64 md:h-80 w-full pr-4 md:pr-6 pl-8">
                {/* Y-axis and grid lines */}
                <div className="absolute inset-y-0 left-0 flex flex-col justify-between text-gray-500 text-xs md:text-sm py-4 md:py-6 w-8">
                  {[0, 0.33, 0.66, 1].map((value, i) => {
                    const maxTasks = Math.max(
                      1,
                      ...weekDaysWithTasks.map((day) => day.taskCount)
                    );
                    const labelValue = Math.round(maxTasks * value);
                    return (
                      <React.Fragment key={i}>
                        <span
                          className={`absolute left-0 transform -translate-y-1/2 ${
                            i === 0
                              ? "bottom-1"
                              : i === 3
                              ? "top-1"
                              : `top-[${100 - value * 100}%]`
                          }`}
                        >
                          {labelValue}
                        </span>
                        <div
                          className="absolute left-6 right-0 h-px bg-gray-200"
                          style={{ bottom: `${value * 100}%` }}
                        />
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-around pl-8 md:pl-10 pb-6">
                  {weekDaysWithTasks.map((day, index) => {
                    const completedCount = day.tasksForDay.filter(
                      (task) => task.completed
                    ).length;
                    const createdCount = day.taskCount;
                    const maxValue = Math.max(
                      1,
                      ...weekDaysWithTasks.map((d) => d.taskCount)
                    );

                    return (
                      <motion.div
                        key={index}
                        className="flex flex-col items-center w-[12%] max-w-[60px] h-full group cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <div className="flex w-full items-end justify-center h-full space-x-1 sm:space-x-2">
                          <motion.div
                            className="w-1/2 bg-blue-500 rounded-t-md relative hover:bg-blue-400 transition-colors duration-200"
                            style={{
                              height: `${(createdCount / maxValue) * 100}%`,
                            }}
                            initial={{ height: 0 }}
                            animate={{
                              height: `${(createdCount / maxValue) * 100}%`,
                            }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            variants={barVariants}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-gray-800 text-[10px] md:text-xs px-2 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-gray-200">
                              Created: {createdCount}
                            </div>
                          </motion.div>
                          <motion.div
                            className="w-1/2 bg-rose-500 rounded-t-md relative hover:bg-rose-400 transition-colors duration-200"
                            style={{
                              height: `${(completedCount / maxValue) * 100}%`,
                            }}
                            initial={{ height: 0 }}
                            animate={{
                              height: `${(completedCount / maxValue) * 100}%`,
                            }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            variants={barVariants}
                          >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-gray-800 text-[10px] md:text-xs px-2 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-gray-200">
                              Completed: {completedCount}
                            </div>
                          </motion.div>
                        </div>
                        <motion.div
                          className={`mt-2 text-xs md:text-sm ${
                            day.isToday
                              ? "text-rose-600 font-bold"
                              : "text-gray-600"
                          }`}
                          variants={itemVariants}
                        >
                          {day.dayName.substring(0, 3)}
                        </motion.div>
                        <motion.div
                          className={`text-[10px] md:text-xs ${
                            day.isToday ? "text-rose-600" : "text-gray-500"
                          }`}
                          variants={itemVariants}
                        >
                          {day.date.getDate()}
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Doughnut chart column */}
            <motion.div
              className="flex flex-col items-center p-6 bg-gray-50 rounded-xl lg:col-span-1 border border-gray-200"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                    delay: 0.1,
                  },
                },
              }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {/* Doughnut chart */}
              <motion.div
                className="relative w-40 h-40 md:w-48 md:h-48 mb-8 cursor-pointer"
                variants={doughnutVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="w-full h-full rounded-full transition-all duration-300"
                  style={{
                    background: `conic-gradient(#f43f5e ${completionPercentage}%, #3b82f6 ${completionPercentage}%)`,
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  }}
                ></div>
                <div className="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center shadow-sm border border-gray-200">
                  <span className="text-3xl md:text-4xl font-bold text-gray-800">
                    {completionPercentage}%
                  </span>
                  <ClipboardList className="w-8 h-8 text-gray-400 mt-2" />
                </div>
              </motion.div>

              {/* Legend with interactive elements */}
              <motion.div
                className="flex flex-col sm:flex-row sm:space-x-8 space-y-2 sm:space-y-0 text-sm w-full justify-center"
                variants={itemVariants}
              >
                <motion.div
                  className="flex items-center space-x-2 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-gray-700 font-medium">
                    Created: <span className="font-bold">{totalTasks}</span>
                  </span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-2 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span className="text-gray-700 font-medium">
                    Completed:{" "}
                    <span className="font-bold">{completedTasks}</span>
                  </span>
                </motion.div>
              </motion.div>

              {/* Additional stats */}
              <motion.div
                className="mt-6 text-sm text-gray-600 text-center"
                variants={itemVariants}
              >
                {totalTasks > 0 ? (
                  <>
                    <p className="mb-1">
                      Average completion:{" "}
                      <span className="font-semibold text-gray-800">
                        {Math.round(completionPercentage)}%
                      </span>
                    </p>
                    <p>
                      {completedTasks === totalTasks ? (
                        <span className="text-rose-600 font-bold">
                          All tasks completed! 🎉
                        </span>
                      ) : (
                        <span className="text-blue-600 font-medium">
                          {totalTasks - completedTasks} remaining
                        </span>
                      )}
                    </p>
                  </>
                ) : (
                  <p className="font-medium">No tasks have been added yet.</p>
                )}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Calendar section with proper spacing and motion */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-gray-200 mt-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                  delay: 0.2,
                },
              },
            }}
            whileHover={{ scale: 1.005 }}
          >
            {/* Compact Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-800">
                  Task Progress
                </h3>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1">
                  <span className="text-gray-900 font-bold">
                    {completedTasks}
                  </span>{" "}
                  of{" "}
                  <span className="text-gray-900 font-bold">{totalTasks}</span>{" "}
                  tasks completed
                </p>
              </div>
              <motion.div
                className="flex items-center space-x-1 text-gray-500 text-xs sm:text-sm cursor-pointer hover:text-blue-600 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>This Week</span>
              </motion.div>
            </div>

            {/* Compact Weekly Task Display - Reduced vertical space */}
            <div className="w-full overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex justify-between min-w-[400px] gap-1">
                {weekDaysWithTasks.map(
                  ({ dayName, taskCount, isToday }, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                flex flex-col items-center justify-center p-2 rounded-lg cursor-pointer
                flex-shrink-0 w-[calc(14.28%-0.25rem)] min-w-[40px]
                transition-all duration-200 ease-in-out
                ${
                  isToday
                    ? "bg-blue-600 text-white shadow-md ring-1 ring-blue-400"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200"
                }
              `}
                    >
                      <span className="text-sm font-medium">
                        {dayName.charAt(0)}
                      </span>
                      {taskCount > 0 && (
                        <span
                          className={`
                    mt-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold
                    ${
                      isToday
                        ? "bg-white text-blue-600"
                        : "bg-blue-500 text-white"
                    }
                  `}
                        >
                          {taskCount}
                        </span>
                      )}
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
