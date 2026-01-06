"use client";

import {
  FiUsers,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiUser,
  FiMail,
} from "react-icons/fi";
import { useState } from "react";
import Link from "next/link";

export default function TeacherDashboard() {
  // Dummy teacher info
  const teacher = {
    name: "Muhammad Ali",
    email: "ali.teacher@university.edu",
  };

  // Dummy stats
  const [stats] = useState({
    classes: 3,
    students: 120,
    subjects: 5,
    attendance_today: 95,
  });

  return (
    <div className="space-y-6 text-gray-800">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Overview of your classes and students
        </p>
      </div>

      {/* Teacher Info Card */}
      <div className="bg-white rounded-xl shadow border p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
          <FiUser size={36} />
        </div>

        <div className="space-y-1 text-center sm:text-left">
          <p className="text-sm text-gray-500">Teacher</p>
          <p className="text-xl font-semibold">{teacher.name}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 text-sm">
            <FiMail />
            {teacher.email}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          label="My Classes"
          value={stats.classes}
          icon={FiUsers}
          bg="bg-blue-100"
          text="text-blue-700"
        />
        <StatCard
          label="Total Students"
          value={stats.students}
          icon={FiUsers}
          bg="bg-green-100"
          text="text-green-700"
        />
        <StatCard
          label="Subjects"
          value={stats.subjects}
          icon={FiBookOpen}
          bg="bg-purple-100"
          text="text-purple-700"
        />
        <StatCard
          label="Attendance Today"
          value={stats.attendance_today}
          icon={FiCheckCircle}
          bg="bg-yellow-100"
          text="text-yellow-700"
        />
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-xl shadow border p-6 text-center">
        <h2 className="text-xl font-semibold mb-8">Features</h2>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/teacher/attendance"
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
          >
            Go to Attendance Page
          </Link>

          <Link
            href="/teacher/users/add"
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
          >
            Add Students
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small Component ---------- */
function StatCard({ label, value, icon: Icon, bg, text }) {
  return (
    <div className={`${bg} rounded-xl p-6 shadow border text-center`}>
      <Icon className={`${text} mx-auto mb-2`} size={28} />
      <p className="text-gray-500 text-sm">{label}</p>
      <p className={`text-3xl font-bold ${text}`}>{value}</p>
    </div>
  );
}
