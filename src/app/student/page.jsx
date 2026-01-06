"use client";

import { useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiHash,
  FiBookOpen,
  FiLayers,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Feedback state
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/student/dashboard");
        const data = await res.json();
        if (!data.error) setProfile(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Loading dashboard...</div>;
  if (!profile) return <div className="p-6 text-red-600">Unable to load dashboard.</div>;

  const { user, student, class: classInfo, attendance_summary, latest_attendance } = profile;

  /* ---------- Feedback Handlers ---------- */
  const handleFeedbackChange = (e) => {
    const text = e.target.value;
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

    if (wordCount <= 250) {
      setFeedback(text);
      setFeedbackError(false);
    } else {
      setFeedbackError(true);
    }
  };

  const handleSubmitFeedback = () => {
    if (!feedback) return alert("Feedback is empty!");
    alert("Feedback submitted successfully! (dummy function)");
    setFeedback("");
    setFeedbackError(false);
  };

  return (
    <div className="space-y-8 text-gray-800">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user.name}</p>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-xl shadow border p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-700">
            <FiUser size={40} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
            <Info label="Name" value={user.name} icon={FiUser} />
            <Info label="Email" value={user.email} icon={FiMail} />
            <Info label="Roll No" value={student.roll_no} icon={FiHash} />
            <Info label="Program" value={classInfo.program_name} icon={FiBookOpen} />
            <Info label="Semester" value={classInfo.semester} icon={FiLayers} />
            <Info label="Section" value={classInfo.section} icon={FiLayers} />
            <Info label="Batch" value={classInfo.start_year} icon={FiCalendar} />
          </div>
        </div>
      </div>

      {/* ATTENDANCE SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard label="Present" value={attendance_summary.present} icon={FiCheckCircle} bg="bg-green-100" text="text-green-700" />
        <StatCard label="Absent" value={attendance_summary.absent} icon={FiXCircle} bg="bg-red-100" text="text-red-600" />
        <StatCard label="Leave / Late" value={attendance_summary.leave_days} icon={FiClock} bg="bg-yellow-100" text="text-yellow-600" />
      </div>

      {/* RECENT ATTENDANCE */}
      <div className="bg-white rounded-xl shadow border p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Attendance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {latest_attendance.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center p-6 text-gray-500">No attendance recorded.</td>
                </tr>
              ) : (
                latest_attendance.map((a, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-3">{formatDate(a.date)}</td>
                    <td className={`p-3 font-semibold ${a.status === "Present" ? "text-green-600" : a.status === "Absent" ? "text-red-600" : "text-yellow-600"}`}>
                      {a.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FEEDBACK SECTION */}
      // FEEDBACK SECTION
<div className="bg-white rounded-xl shadow border p-6 space-y-4">
  <h2 className="text-xl font-semibold">Feedback</h2>
  <textarea
    value={feedback}
    onChange={(e) => {
      const text = e.target.value;
      if (text.length <= 250) {
        setFeedback(text);
        setFeedbackError(false);
      } else {
        setFeedbackError(true);
      }
    }}
    placeholder="Write your feedback here (max 250 characters)..."
    className={`w-full p-4 border rounded-xl focus:outline-none resize-none ${
      feedbackError ? "border-red-600 text-red-600" : "border-gray-300 text-gray-800"
    }`}
    rows={5}
  />
  <p className={`text-sm ${feedbackError ? "text-red-600" : "text-gray-500"}`}>
    {feedback.length} / 250 characters
  </p>
  <button
    onClick={() => {
      if (!feedback) return alert("Feedback is empty!");
      alert("Feedback submitted successfully! (dummy function)");
      setFeedback("");
      setFeedbackError(false);
    }}
    className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition"
  >
    Submit Feedback
  </button>
</div>

    </div>
  );
}

/* ---------- Small Components ---------- */

function Info({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="text-green-600 mt-1" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, bg, text }) {
  return (
    <div className={`${bg} rounded-xl p-6 shadow border text-center`}>
      <Icon className={`${text} mx-auto mb-2`} size={28} />
      <p className="text-gray-500 text-sm">{label}</p>
      <p className={`text-3xl font-bold ${text}`}>{value}</p>
    </div>
  );
}

/* ---------- Date Formatter ---------- */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}
