"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    classes: 0,
    subjects: 0,
  });

  const [userName, setUserName] = useState("");
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    async function fetchCurrentUser() {
      setUserLoading(true);
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          setUserName("");
          setUserLoading(false);
          return;
        }
        const data = await res.json();
        setUserName(data.name || "");
      } catch (err) {
        console.error("Failed to fetch current user", err);
        setUserName("");
      } finally {
        setUserLoading(false);
      }
    }
    fetchCurrentUser();
  }, []);

  // Dummy data for charts
  const attendanceData = [60, 80, 40, 70, 90, 50, 75];
  const activityData = [30, 50, 70, 40, 60, 80, 55];

  return (
    <div className="space-y-6 text-gray-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {userLoading ? "Welcome Back" : `Welcome Back, ${userName || "Admin"}`}
          </h1>
          <p className="text-sm text-gray-500">Let’s dive in and get things done.</p>
        </div>

        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700">
          ⬇ Export report
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard label="Total Students" value={stats.students} />
        <StatCard label="Total Teachers" value={stats.teachers} />
        <StatCard label="Total Classes" value={stats.classes} />
        <StatCard label="Total Subjects" value={stats.subjects} />
      </div>

      {/* Middle Section - Dummy Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Attendance Overview</h2>
          <div className="h-48 flex items-end gap-3 justify-around">
            {attendanceData.map((val, i) => (
              <div
                key={i}
                className="w-6 bg-green-500 rounded transition-all"
                style={{ height: `${val}%` }}
                title={`${val}%`}
              />
            ))}
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Activity Overview</h2>
          <div className="h-48 flex items-end gap-3 justify-around">
            {activityData.map((val, i) => (
              <div
                key={i}
                className="w-6 bg-blue-500 rounded transition-all"
                style={{ height: `${val}%` }}
                title={`${val}%`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small Component ---------- */
function StatCard({ label, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-sm text-gray-500">{label}</h2>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
