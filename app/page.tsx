"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  Filter,
  Download,
  MoreVertical,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  course: string;
  year: string;
  status: "Active" | "Pending" | "Suspended" | "Graduated";
  enrolledDate: string;
  gpa: number;
}

const INITIAL_STUDENTS: Student[] = [
  {
    id: "STU-2026-001",
    name: "Aiden Montgomery",
    email: "aiden.m@university.edu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    course: "Computer Science",
    year: "Year 3",
    status: "Active",
    enrolledDate: "2024-09-01",
    gpa: 3.88,
  },
  {
    id: "STU-2026-002",
    name: "Sophia Rodriguez",
    email: "sophia.r@university.edu",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    course: "Biomedical Engineering",
    year: "Year 2",
    status: "Active",
    enrolledDate: "2025-01-15",
    gpa: 3.94,
  },
  {
    id: "STU-2026-003",
    name: "Marcus Chen",
    email: "marcus.chen@university.edu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    course: "Business Administration",
    year: "Year 4",
    status: "Graduated",
    enrolledDate: "2023-09-10",
    gpa: 3.65,
  },
  {
    id: "STU-2026-004",
    name: "Amara Okafor",
    email: "amara.o@university.edu",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    course: "Data Science & AI",
    year: "Year 1",
    status: "Pending",
    enrolledDate: "2026-02-01",
    gpa: 3.72,
  },
  {
    id: "STU-2026-005",
    name: "Liam O'Connor",
    email: "liam.oc@university.edu",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    course: "Cyber Security",
    year: "Year 3",
    status: "Active",
    enrolledDate: "2024-09-01",
    gpa: 3.45,
  },
  {
    id: "STU-2026-006",
    name: "Elena Rostova",
    email: "elena.r@university.edu",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    course: "Architecture & Design",
    year: "Year 2",
    status: "Suspended",
    enrolledDate: "2025-02-10",
    gpa: 2.89,
  },
  {
    id: "STU-2026-007",
    name: "Devon Vance",
    email: "devon.v@university.edu",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    course: "Electrical Engineering",
    year: "Year 1",
    status: "Active",
    enrolledDate: "2026-01-20",
    gpa: 3.55,
  },
  {
    id: "STU-2026-008",
    name: "Chloe Dupont",
    email: "chloe.d@university.edu",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    course: "International Relations",
    year: "Year 4",
    status: "Active",
    enrolledDate: "2023-09-12",
    gpa: 3.82,
  },
];

type SortKey = "id" | "name" | "course" | "year" | "status" | "gpa" | "enrolledDate";
type SortDirection = "asc" | "desc";

export default function AdminHomePage() {
  const [students] = useState<Student[]>(INITIAL_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [courseFilter, setCourseFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [activeTab, setActiveTab] = useState("students");

  // Distinct courses for filter dropdown
  const courses = useMemo(() => {
    return Array.from(new Set(INITIAL_STUDENTS.map((s) => s.course)));
  }, []);

  // Filtering and Sorting
  const filteredAndSortedStudents = useMemo(() => {
    return students
      .filter((student) => {
        const matchesQuery =
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.course.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
          statusFilter === "All" || student.status === statusFilter;

        const matchesCourse =
          courseFilter === "All" || student.course === courseFilter;

        return matchesQuery && matchesStatus && matchesCourse;
      })
      .sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        if (typeof valA === "string") {
          return sortDirection === "asc"
            ? valA.localeCompare(valB as string)
            : (valB as string).localeCompare(valA);
        }

        if (typeof valA === "number") {
          return sortDirection === "asc"
            ? (valA as number) - (valB as number)
            : (valB as number) - (valA as number);
        }

        return 0;
      });
  }, [students, searchQuery, statusFilter, courseFilter, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-indigo-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
    );
  };

  const getStatusBadge = (status: Student["status"]) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Active
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-600/20">
            <Clock className="w-3 h-3 text-amber-500" />
            Pending
          </span>
        );
      case "Suspended":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 ring-1 ring-rose-600/20">
            <AlertCircle className="w-3 h-3 text-rose-500" />
            Suspended
          </span>
        );
      case "Graduated":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-600/20">
            <GraduationCap className="w-3 h-3 text-blue-500" />
            Graduated
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">EduPulse</h1>
              <p className="text-xs text-indigo-400 font-medium">Administration</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 flex-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab("students")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "students"
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

          <button
            onClick={() => setActiveTab("courses")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "courses"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Courses & Programs
          </button>

          <button
            onClick={() => setActiveTab("schedule")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "schedule"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Academic Calendar
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "settings"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
              AD
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">Administrator</p>
              <p className="text-[11px] text-slate-400 truncate">admin@edupulse.edu</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-xs">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Students Directory</h2>
            <p className="text-xs text-slate-500">
              Manage enrollments, inspect academic standings, and filter student records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-colors">
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
            </button>
            <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3.5 py-2 rounded-lg shadow-sm transition-all shadow-indigo-600/20">
              <Plus className="w-4 h-4" />
              Register Student
            </button>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-6 space-y-6">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Enrolled</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">1,482</h3>
                <span className="text-[11px] font-medium text-emerald-600 mt-1 inline-flex items-center gap-1">
                  ↑ +8.4% vs last term
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Students</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">1,390</h3>
                <span className="text-[11px] font-medium text-emerald-600 mt-1 inline-flex items-center gap-1">
                  93.8% retention rate
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Average GPA</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">3.61</h3>
                <span className="text-[11px] font-medium text-indigo-600 mt-1 inline-flex items-center gap-1">
                  Dean&apos;s Honor standard
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Programs</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">24</h3>
                <span className="text-[11px] font-medium text-slate-500 mt-1 inline-flex items-center gap-1">
                  Across 6 faculties
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Interactive Table Container */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Filter and Search Bar */}
            <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student by name, ID, email, or course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Status Dropdown */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-600">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                {/* Course Dropdown */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                  <span className="text-xs font-medium text-slate-600">Course:</span>
                  <select
                    value={courseFilter}
                    onChange={(e) => setCourseFilter(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer max-w-[140px] truncate"
                  >
                    <option value="All">All Courses</option>
                    {courses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("All");
                    setCourseFilter("All");
                  }}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 px-2.5 py-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Reset
                </button>

                <button className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-2xs transition-colors">
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-600 text-[11px] font-semibold uppercase tracking-wider">
                    <th
                      onClick={() => handleSort("id")}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Student ID</span>
                        {getSortIcon("id")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("name")}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Student Name</span>
                        {getSortIcon("name")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("course")}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Course</span>
                        {getSortIcon("course")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("year")}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Year</span>
                        {getSortIcon("year")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("gpa")}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>GPA</span>
                        {getSortIcon("gpa")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("status")}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Status</span>
                        {getSortIcon("status")}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort("enrolledDate")}
                      className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none group"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>Enrolled Date</span>
                        {getSortIcon("enrolledDate")}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredAndSortedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users className="w-8 h-8 text-slate-300" />
                          <p className="text-sm font-semibold text-slate-700">No students found</p>
                          <p className="text-xs text-slate-400">
                            Try adjusting your search query or clear the active filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAndSortedStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-indigo-50/40 transition-colors group"
                      >
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                          {student.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                            />
                            <div>
                              <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                {student.name}
                              </p>
                              <p className="text-[11px] text-slate-500">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                          {student.course}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                            {student.year}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-semibold ${
                              student.gpa >= 3.8
                                ? "text-emerald-600 font-bold"
                                : student.gpa >= 3.0
                                ? "text-slate-800"
                                : "text-rose-600"
                            }`}
                          >
                            {student.gpa.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">{getStatusBadge(student.status)}</td>
                        <td className="py-3.5 px-4 text-slate-500">{student.enrolledDate}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / Summary Footer */}
            <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50">
              <p>
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {filteredAndSortedStudents.length}
                </span>{" "}
                of <span className="font-semibold text-slate-800">{students.length}</span> students
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  disabled
                  className="p-1.5 rounded-md border border-slate-200 text-slate-400 bg-white disabled:opacity-50 cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="px-3 py-1 rounded-md bg-indigo-600 text-white font-medium">
                  1
                </button>
                <button className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100 bg-white transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
