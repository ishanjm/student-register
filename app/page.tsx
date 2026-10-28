"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  fetchStudents,
  createStudent,
  updateStudentRecord,
  removeStudent,
} from "@/store/studentSlice";
import { StudentModal } from "@/components/StudentModal";
import { AdminUsersManager } from "@/components/AdminUsersManager";
import { AdminLayoutWrapper } from "@/components/AdminLayoutWrapper";
import { Student } from "@/lib/studentData";
import {
  Users,
  GraduationCap,
  BookOpen,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserCheck,
  Edit2,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

type SortKey = "id" | "name" | "course" | "year" | "status" | "gpa" | "enrolledDate";
type SortDirection = "asc" | "desc";

export default function AdminHomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { students, loading, error } = useSelector((state: RootState) => state.students);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [courseFilter, setCourseFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [activeTab, setActiveTab] = useState<"students" | "users">("students");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Distinct courses for filter dropdown
  const courses = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.course)));
  }, [students]);

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
        const valA = a[sortKey];
        const valB = b[sortKey];

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

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently remove this student record?")) {
      await dispatch(removeStudent(id));
    }
  };

  const handleModalSubmit = async (student: Student) => {
    if (editingStudent) {
      await dispatch(updateStudentRecord(student));
    } else {
      await dispatch(createStudent(student));
    }
  };

  return (
    <AdminLayoutWrapper
      title={activeTab === "users" ? "Account Approvals" : "Students Directory"}
      subtitle={
        activeTab === "users"
          ? "Manage newly registered user access permissions and activations."
          : "Manage enrollments, inspect academic standings, and filter student records."
      }
      activeNav={activeTab}
      onTabChange={setActiveTab}
      actions={
        activeTab === "students" ? (
          <>
            <button
              onClick={() => dispatch(fetchStudents())}
              disabled={loading}
              title="Reload from API"
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-indigo-600" : ""}`} />
            </button>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-all shadow-indigo-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Register Student
            </button>
          </>
        ) : null
      }
    >
      {activeTab === "users" ? (
        <AdminUsersManager />
      ) : (
        <>
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              {error}
            </div>
          )}

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Enrolled</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{students.length}</h3>
                <span className="text-[11px] font-medium text-emerald-600 mt-1 inline-flex items-center gap-1">
                  Live MySQL database records
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Students</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {students.filter((s) => s.status === "Active").length}
                </h3>
                <span className="text-[11px] font-medium text-emerald-600 mt-1 inline-flex items-center gap-1">
                  {students.length > 0
                    ? `${Math.round(
                        (students.filter((s) => s.status === "Active").length / students.length) * 100
                      )}% retention rate`
                    : "0%"}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Average GPA</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {students.length > 0
                    ? (students.reduce((acc, s) => acc + (s.gpa || 0), 0) / students.length).toFixed(2)
                    : "0.00"}
                </h3>
                <span className="text-[11px] font-medium text-indigo-600 mt-1 inline-flex items-center gap-1">
                  Overall academic standing
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Programs</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{courses.length}</h3>
                <span className="text-[11px] font-medium text-slate-500 mt-1 inline-flex items-center gap-1">
                  Across campus faculties
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
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 px-2.5 py-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Reset
                </button>

                <button className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer">
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[300px]">
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
                  {loading && students.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
                          <p className="text-xs text-slate-600">Loading student records from API...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredAndSortedStudents.length === 0 ? (
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
                        className="hover:bg-indigo-50/40 transition-colors group relative"
                      >
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-600">
                          <Link
                            href={`/students/${encodeURIComponent(student.id)}`}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                          >
                            {student.id}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                            />
                            <div>
                              <Link
                                href={`/students/${encodeURIComponent(student.id)}`}
                                className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors block"
                              >
                                {student.name}
                              </Link>
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
                              (student.gpa || 0) >= 3.8
                                ? "text-emerald-600 font-bold"
                                : (student.gpa || 0) >= 3.0
                                ? "text-slate-800"
                                : "text-rose-600"
                            }`}
                          >
                            {(student.gpa || 0).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">{getStatusBadge(student.status)}</td>
                        <td className="py-3.5 px-4 text-slate-500">{student.enrolledDate}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1 justify-end">
                            <Link
                              href={`/students/${encodeURIComponent(student.id)}`}
                              title="View Details"
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleOpenEdit(student)}
                              title="Edit Student"
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(student.id)}
                              title="Delete Record"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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
        </>
      )}

      {/* Register / Edit Modal using Formik */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingStudent}
      />
    </AdminLayoutWrapper>
  );
}
