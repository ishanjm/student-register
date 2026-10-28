"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { X, UserPlus, Save } from "lucide-react";
import { Student, ACADEMIC_YEARS, STATUS_LIST } from "@/lib/studentData";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: Student) => void;
  initialData?: Student | null;
}

const StudentValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email address is required"),
  phone: Yup.string()
    .required("Contact phone number is required"),
  year: Yup.string()
    .required("Academic year is required"),
  status: Yup.string()
    .oneOf(["Active", "Pending", "Suspended", "Graduated"])
    .required("Status is required"),
  enrolledDate: Yup.string()
    .required("Enrollment date is required"),
  dateOfBirth: Yup.string().optional(),
  guardianName: Yup.string().optional(),
  emergencyContact: Yup.string().optional(),
  address: Yup.string().optional(),
  bio: Yup.string().max(250, "Bio should be under 250 characters").optional(),
});

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  if (!isOpen) return null;

  const isEditMode = Boolean(initialData);

  const initialValues = {
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    year: initialData?.year || ACADEMIC_YEARS[0],
    status: initialData?.status || "Active",
    enrolledDate: initialData?.enrolledDate || new Date().toISOString().split("T")[0],
    dateOfBirth: initialData?.dateOfBirth || "2005-01-01",
    guardianName: initialData?.guardianName || "",
    emergencyContact: initialData?.emergencyContact || "",
    address: initialData?.address || "",
    bio: initialData?.bio || "",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              {isEditMode ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEditMode ? "Edit Student Details" : "Register New Student"}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditMode
                  ? `Updating record for ${initialData?.id}`
                  : "Fill in the student's personal and registration information"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <Formik
          initialValues={initialValues}
          validationSchema={StudentValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            const finalStudent: Student = {
              id: initialData?.id || `STU-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
              avatar:
                initialData?.avatar ||
                `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
              name: values.name,
              email: values.email,
              phone: values.phone,
              course: initialData?.course || "General Studies",
              year: values.year,
              status: values.status as Student["status"],
              gpa: initialData?.gpa !== undefined ? initialData.gpa : 3.5,
              enrolledDate: values.enrolledDate,
              dateOfBirth: values.dateOfBirth,
              guardianName: values.guardianName,
              emergencyContact: values.emergencyContact,
              address: values.address,
              bio: values.bio,
            };

            onSubmit(finalStudent);
            setSubmitting(false);
            onClose();
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-5 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                    <Field
                      name="name"
                      placeholder="e.g. Elena Rostova"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                    <Field
                      name="email"
                      type="email"
                      placeholder="e.g. elena@university.edu"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                    <Field
                      name="phone"
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5"
                    />
                  </div>

                  {/* Academic Year */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Academic Year *</label>
                    <Field
                      as="select"
                      name="year"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    >
                      {ACADEMIC_YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="year"
                      component="div"
                      className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Enrollment Status *</label>
                    <Field
                      as="select"
                      name="status"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    >
                      {STATUS_LIST.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5"
                    />
                  </div>

                  {/* Enrollment Date */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Enrollment Date *</label>
                    <Field
                      name="enrolledDate"
                      type="date"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                    />
                    <ErrorMessage
                      name="enrolledDate"
                      component="div"
                      className="text-[11px] text-rose-600 flex items-center gap-1 mt-0.5"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                    Personal & Guardian Information (Optional)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Date of Birth</label>
                      <Field
                        name="dateOfBirth"
                        type="date"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">Guardian Name</label>
                      <Field
                        name="guardianName"
                        placeholder="e.g. Viktor Rostov"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">Emergency Contact</label>
                      <Field
                        name="emergencyContact"
                        placeholder="+1 (555) 999-0000"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">Residential Address</label>
                      <Field
                        name="address"
                        placeholder="Street, City, State, ZIP"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">Student Bio</label>
                      <Field
                        as="textarea"
                        rows={2}
                        name="bio"
                        placeholder="Academic interests, extracurricular activities..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isEditMode ? <Save className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  {isEditMode ? "Save Changes" : "Submit Registration"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
