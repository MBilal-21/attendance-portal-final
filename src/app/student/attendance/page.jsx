"use client";

import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";

export default function StudentAttendancePage() {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    async function loadAttendance() {
      try {
        const res = await fetch("/api/student/attendance");
        const data = await res.json();

        if (!data.error) {
          setStudent({
            id: data.student_id,
            name: data.student_name,
          });
          setAttendance(data.attendance);
          setFiltered(data.attendance);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }

    loadAttendance();
  }, []);

  useEffect(() => {
    if (!dateFilter) setFiltered(attendance);
    else setFiltered(attendance.filter((a) => a.date === dateFilter));
  }, [dateFilter, attendance]);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading attendance...</div>;
  }

  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const absentCount = attendance.filter((a) => a.status === "Absent").length;
  const leaveCount = attendance.filter((a) => a.status === "Leave").length;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Attendance Overview
        </h1>
        <p className="text-gray-500">
          Student: <span className="font-medium">{student?.name}</span>
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <SummaryCard
          icon={<FaCheckCircle />}
          label="Present"
          value={presentCount}
          color="green"
        />
        <SummaryCard
          icon={<FaTimesCircle />}
          label="Absent"
          value={absentCount}
          color="red"
        />
        <SummaryCard
          icon={<FaClock />}
          label="Leave"
          value={leaveCount}
          color="yellow"
        />
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl shadow">
        <FaFilter className="text-gray-500" />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        />
        <button
          onClick={() => setDateFilter("")}
          className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
        >
          Clear
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 border-b font-semibold flex items-center gap-2">
          <FaCalendarAlt className="text-gray-600" />
          Attendance Records
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-6 text-center text-gray-500">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                filtered.map((a, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-3">
                      {formatDate(a.date)}
                    </td>
                    <td
                      className={`p-3 font-semibold ${
                        a.status === "Present"
                          ? "text-green-600"
                          : a.status === "Absent"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {a.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

/* ---------- Helper Components ---------- */

function SummaryCard({ icon, label, value, color }) {
  const colors = {
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
    yellow: "bg-yellow-50 text-yellow-700",
  };

  return (
    <div className={`p-6 rounded-xl shadow ${colors[color]}`}>
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <p className="text-sm">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Date Formatter ---------- */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}
