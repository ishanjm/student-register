"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { AdminLayoutWrapper } from "@/components/AdminLayoutWrapper";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Award,
  BookOpen,
  User,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  School,
  RefreshCw,
} from "lucide-react";
import { Student } from "@/lib/studentData";

export default function StudentDetailsClient({ studentId }: { studentId: string }) {
  const reduxStudents = useSelector((state: RootState) => state.students.students);

  // Local state for fetched student if navigated directly to URL
  const [fetchedStudent, setFetchedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);

  // Try finding student in Redux store first
  const existingFromRedux = reduxStudents.find(
    (s) => s.id.toLowerCase() === studentId.toLowerCase()
  );

  useEffect(() => {
    if (!existingFromRedux && studentId) {
      setLoading(true);
      axios
        .get(`/api/students/${encodeURIComponent(studentId)}`)
        .then((res) => {
          if (res.data?.student) {
            setFetchedStudent(res.data.student);
          }
        })
        .catch((err) => {
          console.warn("Could not fetch student by ID from API:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [existingFromRedux, studentId]);

  const student =
    existingFromRedux ||
    fetchedStudent || {
      id: studentId,
      name: "Enrolled Student",
      email: `${studentId.toLowerCase()}@university.edu`,
      phone: "+1 (555) 000-0000",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      course: "General Studies",
      year: "Year 1",
      status: "Active" as const,
      enrolledDate: "2024-09-01",
      gpa: 3.5,
      dateOfBirth: "2004-05-15",
      address: "Campus Housing Hall 4",
      guardianName: "Family Contact",
      emergencyContact: "+1 (555) 999-1111",
      bio: "Undergraduate student currently conducting academic research and coursework.",
    };

  const getStatusBadge = (status: Student["status"]) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Active Enrollment
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-600/20">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Pending Verification
          </span>
        );
      case "Suspended":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 ring-1 ring-rose-600/20">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            Temporarily Suspended
          </span>
        );
      case "Graduated":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-600/20">
            <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
            Alumni / Graduated
          </span>
        );
    }
  };

  return (
    <AdminLayoutWrapper
      title={`Student Profile: ${student.name}`}
      subtitle={`Student ID: ${student.id} • Registered academic record and contact details.`}
      showBackToDirectory={true}
      actions={
        <div className="flex items-center gap-2">
          {loading && <RefreshCw className="w-4 h-4 animate-spin text-indigo-600 mr-1" />}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Directory
          </Link>
        </div>
      }
    >
      {/* Profile Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-600"></div>

        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-14">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-28 h-28 rounded-2xl object-cover ring-4 ring-white shadow-lg bg-white"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
                {getStatusBadge(student.status)}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {student.course} •{" "}
                <span className="text-indigo-600 font-semibold">{student.year}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Grid Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academic & Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              Academic Overview
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[11px] text-slate-500 font-medium">Current GPA</p>
                <p className="text-xl font-bold text-indigo-600 mt-1">
                  {(student.gpa || 3.5).toFixed(2)}
                </p>
                <span className="text-[10px] text-slate-400">Scale of 4.0</span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[11px] text-slate-500 font-medium">Academic Year</p>
                <p className="text-xl font-bold text-slate-800 mt-1">{student.year}</p>
                <span className="text-[10px] text-slate-400">Undergraduate</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Enrolled Date
                </span>
                <span className="font-semibold text-slate-800">{student.enrolledDate}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <School className="w-3.5 h-3.5 text-slate-400" />
                  Major / Department
                </span>
                <span className="font-semibold text-slate-800">{student.course}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  Standing
                </span>
                <span className="font-semibold text-emerald-600">Good Standing</span>
              </div>
            </div>
          </div>

          {/* Emergency & Guardian Contact */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Emergency & Guardian
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Guardian Name</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  {student.guardianName || "Not specified"}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Emergency Contact</span>
                <p className="text-xs font-semibold text-slate-800 mt-0.5">
                  {student.emergencyContact || student.phone || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Two Columns: Bio, Contact, & Academic Records */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Contact & Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <Mail className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Institutional Email</p>
                  <p className="text-xs font-semibold text-slate-800 break-all">{student.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <Phone className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Primary Contact</p>
                  <p className="text-xs font-semibold text-slate-800">{student.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <Calendar className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Date of Birth</p>
                  <p className="text-xs font-semibold text-slate-800">
                    {student.dateOfBirth || "2004-05-15"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <MapPin className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400 font-medium">Residential Address</p>
                  <p className="text-xs font-semibold text-slate-800">
                    {student.address || "Main Campus Residence, Building B"}
                  </p>
                </div>
              </div>
            </div>

            {student.bio && (
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Student Biography & Academic Objective
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {student.bio}
                </p>
              </div>
            )}
          </div>

          {/* Current Semester Courses */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Current Semester Enrolled Modules
            </h3>

            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Advanced Algorithms & Data Structures</p>
                  <p className="text-[11px] text-slate-400">CS-301 • 4 Credits • Prof. K. Vance</p>
                </div>
                <span className="font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                  Grade: A (4.0)
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Database Architecture & Systems</p>
                  <p className="text-[11px] text-slate-400">CS-310 • 3 Credits • Dr. M. Rodriguez</p>
                </div>
                <span className="font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                  Grade: A- (3.7)
                </span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Distributed Cloud Computing</p>
                  <p className="text-[11px] text-slate-400">CS-340 • 4 Credits • Prof. S. Becker</p>
                </div>
                <span className="font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                  Grade: A (4.0)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
