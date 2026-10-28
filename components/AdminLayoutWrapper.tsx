"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { fetchStudents } from "@/store/studentSlice";
import {
  Users,
  GraduationCap,
  ShieldCheck,
  LogOut,
  Bell,
  ArrowLeft,
} from "lucide-react";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "approved" | "pending" | "rejected";
}

interface AdminLayoutWrapperProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  activeNav?: "students" | "users";
  onTabChange?: (tab: "students" | "users") => void;
  showBackToDirectory?: boolean;
}

export function AdminLayoutWrapper({
  children,
  title = "Students Directory",
  subtitle = "Manage enrollments, inspect academic standings, and filter student records.",
  actions,
  activeNav = "students",
  onTabChange,
  showBackToDirectory = false,
}: AdminLayoutWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const students = useSelector((state: RootState) => state.students.students);

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // Fetch logged in user
    axios
      .get("/api/auth/me")
      .then((res) => {
        if (res.data?.user) {
          setCurrentUser(res.data.user);
        }
      })
      .catch(() => {});

    // Ensure students are loaded if empty
    if (students.length === 0) {
      dispatch(fetchStudents());
    }
  }, [dispatch, students.length]);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const handleNavClick = (tab: "students" | "users") => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">EduPulse</h1>
              <p className="text-xs text-indigo-400 font-medium">Administration</p>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-1.5 flex-1">
          {pathname !== "/" && showBackToDirectory && (
            <Link
              href="/"
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-indigo-400 hover:text-white bg-indigo-950/40 border border-indigo-900/50 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Directory
            </Link>
          )}

          <button
            onClick={() => handleNavClick("students")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeNav === "students"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Users className="w-4 h-4" />
            Students Directory
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {students.length}
            </span>
          </button>

          {/* Admin user management tab */}
          {currentUser?.role === "admin" && (
            <button
              onClick={() => handleNavClick("users")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeNav === "users"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              User Approvals
            </button>
          )}
        </nav>

        {/* User Card with Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 truncate">
              <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs uppercase">
                {currentUser?.name ? currentUser.name.substring(0, 2) : "US"}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">
                  {currentUser?.name || "Logged In User"}
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                      currentUser?.role === "admin"
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {currentUser?.role || "User"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {actions}

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="p-6 space-y-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
