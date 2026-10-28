"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface DbUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "approved" | "pending" | "rejected";
  createdAt: string;
}

export function AdminUsersManager() {
  const [users, setUsers] = useState<DbUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/admin/users");
      setUsers(res.data.users || []);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { error?: string } } };
      setError(axiosErr.response?.data?.error || "Failed to load registered accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (
    userId: number,
    newStatus: "approved" | "rejected" | "pending"
  ) => {
    setActionLoadingId(userId);
    try {
      await axios.patch("/api/admin/users", { userId, status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (err: unknown) {
      alert("Failed to update status. Only admins can approve accounts.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status: DbUser["status"]) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Approved
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-600/20">
            <Clock className="w-3 h-3 text-amber-500" />
            Pending Approval
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 ring-1 ring-rose-600/20">
            <XCircle className="w-3 h-3 text-rose-500" />
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            User Account Approvals & Administration
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            1st user was granted Admin privileges. Approve or reject newly registered users before they can log in.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Users
        </button>
      </div>

      {error ? (
        <div className="p-6 text-center text-xs text-rose-600 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      ) : loading ? (
        <div className="p-8 text-center text-xs text-slate-500">
          Loading registered accounts from database...
        </div>
      ) : users.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500">
          No registered users found in database.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-600 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Approval Status</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900">{u.name}</p>
                    <p className="text-[11px] text-slate-500">{u.email}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        u.role === "admin"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {u.role === "admin" && <Shield className="w-3 h-3 text-purple-600" />}
                      {u.role === "admin" ? "Administrator" : "Standard User"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(u.status)}</td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {u.role === "admin" ? (
                      <span className="text-[11px] text-slate-400 font-medium italic">
                        Master Admin
                      </span>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {u.status !== "approved" && (
                          <button
                            onClick={() => handleUpdateStatus(u.id, "approved")}
                            disabled={actionLoadingId === u.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Approve
                          </button>
                        )}
                        {u.status !== "rejected" && (
                          <button
                            onClick={() => handleUpdateStatus(u.id, "rejected")}
                            disabled={actionLoadingId === u.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Reject
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
