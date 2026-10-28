"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Clock,
} from "lucide-react";

const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Full name must be at least 2 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Please provide a valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

export default function SignUpPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<{
    title: string;
    description: string;
    isAdmin: boolean;
  } | null>(null);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Aesthetic glowing gradients */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
            <GraduationCap className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-white">
          Create an Account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Register to access the student administration system
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-100">
          {serverError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="leading-relaxed">{serverError}</div>
            </div>
          )}

          {infoMessage ? (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  infoMessage.isAdmin
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-amber-50 border-amber-200 text-amber-900"
                }`}
              >
                {infoMessage.isAdmin ? (
                  <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <Clock className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
                )}
                <div>
                  <h4 className="font-bold text-xs">{infoMessage.title}</h4>
                  <p className="text-xs mt-1 leading-relaxed">{infoMessage.description}</p>
                </div>
              </div>

              {infoMessage.isAdmin ? (
                <button
                  onClick={() => router.push("/")}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg shadow-md text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer shadow-indigo-600/30"
                >
                  Proceed to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg shadow-md text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 transition-all cursor-pointer"
                >
                  Go to Login Screen
                </button>
              )}
            </div>
          ) : (
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={SignUpSchema}
              onSubmit={async (values, { setSubmitting }) => {
                setServerError(null);
                try {
                  const res = await axios.post("/api/auth/signup", {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                  });

                  if (res.data.isFirstUser) {
                    setInfoMessage({
                      title: "Administrator Account Activated!",
                      description:
                        "You are the first user registered in the system. Your account has been provisioned with full Administrator privileges and automatically approved.",
                      isAdmin: true,
                    });
                  } else {
                    setInfoMessage({
                      title: "Account Registration Received (Pending Approval)",
                      description:
                        "Your registration was submitted successfully. Because you are not the primary administrator, an existing admin must review and activate your account before you can log in.",
                      isAdmin: false,
                    });
                  }
                } catch (err: unknown) {
                  const axiosErr = err as {
                    response?: { data?: { error?: string } };
                  };
                  const msg =
                    axiosErr.response?.data?.error ||
                    "Could not complete registration. Check database connection.";
                  setServerError(msg);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Full Name
                    </label>
                    <div className="mt-1.5 relative rounded-lg shadow-2xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <Field
                        type="text"
                        name="name"
                        placeholder="e.g. John Doe"
                        className="block w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-[11px] text-rose-600 mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Email address
                    </label>
                    <div className="mt-1.5 relative rounded-lg shadow-2xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <Field
                        type="email"
                        name="email"
                        placeholder="john.doe@university.edu"
                        className="block w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-[11px] text-rose-600 mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Password (min 6 chars)
                    </label>
                    <div className="mt-1.5 relative rounded-lg shadow-2xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <Field
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        className="block w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-[11px] text-rose-600 mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Confirm Password
                    </label>
                    <div className="mt-1.5 relative rounded-lg shadow-2xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <Field
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••"
                        className="block w-full pl-9 pr-3 py-2.5 text-xs text-slate-900 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                      />
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-[11px] text-rose-600 mt-1"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg shadow-md text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer shadow-indigo-600/30"
                    >
                      {isSubmitting ? "Creating Account..." : "Register Account"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
