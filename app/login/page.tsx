"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please provide a valid email address")
    .required("Email address is required"),
  password: Yup.string().required("Password is required"),
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const registeredMsg = searchParams.get("registered");
  const from = searchParams.get("from") || "/";

  const [serverError, setServerError] = useState<string | null>(
    urlError === "pending_approval"
      ? "Your account has registered but is pending administrator approval before you can access the system."
      : null
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(
    registeredMsg ? "Registration successful! You may now sign in." : null
  );

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background aesthetic gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
            <GraduationCap className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-white">
          Sign in to EduPulse
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Student Registration & Academic Administration Portal
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

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div className="leading-relaxed">{successMsg}</div>
            </div>
          )}

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setServerError(null);
              setSuccessMsg(null);
              try {
                const res = await axios.post("/api/auth/login", values);
                if (res.status === 200) {
                  router.push(from);
                  router.refresh();
                }
              } catch (err: unknown) {
                const axiosErr = err as {
                  response?: { data?: { error?: string; status?: string } };
                };
                const msg =
                  axiosErr.response?.data?.error ||
                  "Invalid login credentials or database connection issue.";
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
                    Email address
                  </label>
                  <div className="mt-1.5 relative rounded-lg shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <Field
                      type="email"
                      name="email"
                      placeholder="admin@edupulse.edu"
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
                    Password
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

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg shadow-md text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer shadow-indigo-600/30"
                  >
                    {isSubmitting ? "Authenticating..." : "Sign in to Dashboard"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center">
            <p className="text-xs text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Note on first user admin promotion & approval policy */}
        <div className="mt-6 text-center text-xs text-slate-400 space-y-1">
          <p className="flex items-center justify-center gap-1.5 text-indigo-300">
            <Clock className="w-3.5 h-3.5" />
            First registered user automatically becomes System Administrator.
          </p>
          <p>Subsequent users require admin activation before login.</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
      <LoginForm />
    </Suspense>
  );
}
