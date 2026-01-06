"use client";

import { useState, useEffect } from "react";
import { FaUserGraduate } from "react-icons/fa";
import { IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import { TbCalendar } from "react-icons/tb";

export default function AttendancePage() {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState("");

  const totalStudents = students.length;
  const totalPresent = Object.values(attendance).filter(v => v === "Present").length;
  const totalAbsent = Object.values(attendance).filter(v => v === "Absent").length;
  const totalLeave = Object.values(attendance).filter(v => v === "Leave").length;

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  useEffect(() => {
    async function loadClasses() {
      const res = await fetch("/api/admin/attendance/classes");
      const data = await res.json();
      setClasses(data);
    }
    loadClasses();
  }, []);

  async function loadStudents(class_id, selectedDate) {
    if (!class_id || !selectedDate) return;

    const res = await fetch(`/api/admin/attendance/students?class_id=${class_id}`);
    const studentsList = await res.json();
    setStudents(studentsList);

    const attRes = await fetch(
      `/api/admin/attendance/get?class_id=${class_id}&date=${selectedDate}`
    );
    const saved = await attRes.json();

    const savedMap = {};
    saved.forEach((row) => {
      savedMap[row.student_id] = row.status;
    });

    const initial = {};
    studentsList.forEach((s) => {
      initial[s.id] = savedMap[s.id] || "Absent";
    });

    setAttendance(initial);
  }

  useEffect(() => {
    if (selectedClass && date) loadStudents(selectedClass, date);
  }, [selectedClass, date]);

  async function saveAttendance() {
    const body = {
      class_id: Number(selectedClass),
      subject_id: 1,
      date,
      records: Object.keys(attendance).map((id) => ({
        student_id: Number(id),
        status: attendance[id],
      })),
    };

    const res = await fetch("/api/admin/attendance/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const msg = await res.json();
    alert(msg.message || msg.error);
  }

  return (
  <div className="p-8 space-y-6 text-gray-900">

    {/* PAGE TITLE */}
    <div>
      <h1 className="text-3xl font-bold">Attendance</h1>
      <div className="text-sm text-gray-500 mt-1">
        Dashboard {" >> "} Attendance {" >> "} 
        <span className="text-black font-medium">
          {selectedClass ? classes.find(c => c.id == selectedClass)?.class_name : "Select Class"}
        </span>
      </div>
    </div>

    {/* CLASS SELECT + DATE + ADD STUDENT */}
    <div className="flex flex-wrap items-center justify-between gap-4">

      {/* CLASS SELECT */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Class:</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 outline-none"
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.class_name}
            </option>
          ))}
        </select>
      </div>

      {/* DATE RANGE BOX */}
      <div className="flex items-center gap-2 border rounded-md px-3 py-2">
        <TbCalendar size={18} className="text-gray-700" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="outline-none"
        />
      </div>

      {/* ADD STUDENT BUTTON */}
      {/* <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">
        Add Student
      </button> */}
    </div>

    {/* SUMMARY CARDS */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

      <div className="bg-white border p-4 rounded-xl shadow-sm flex items-center gap-4">
        <FaUserGraduate className="text-purple-600 bg-purple-100 p-2 rounded-full" size={40} />
        <div>
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-bold">{students.length}</p>
        </div>
      </div>

      <div className="bg-white border p-4 rounded-xl shadow-sm flex items-center gap-4">
        <IoCheckmarkCircleOutline className="text-green-600 bg-green-100 p-2 rounded-full" size={40} />
        <div>
          <p className="text-sm text-gray-500">Present</p>
          <p className="text-2xl font-bold">
            {Object.values(attendance).filter(v => v === "Present").length}
          </p>
        </div>
      </div>

      <div className="bg-white border p-4 rounded-xl shadow-sm flex items-center gap-4">
        <IoCloseCircleOutline className="text-red-600 bg-red-100 p-2 rounded-full" size={40} />
        <div>
          <p className="text-sm text-gray-500">Absent</p>
          <p className="text-2xl font-bold">
            {Object.values(attendance).filter(v => v === "Absent").length}
          </p>
        </div>
      </div>

      <div className="bg-white border p-4 rounded-xl shadow-sm flex items-center gap-4">
        <FaUserGraduate className="text-yellow-600 bg-yellow-100 p-2 rounded-full" size={40} />
        <div>
          <p className="text-sm text-gray-500">Leave</p>
          <p className="text-2xl font-bold">
            {Object.values(attendance).filter(v => v === "Leave").length}
          </p>
        </div>
      </div>
    </div>

    {/* STUDENT TABLE */}
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <table className="w-full">
        <thead className="text-sm text-gray-600 border-b">
          <tr>
            <th className="p-3 text-left">Sr</th>
            <th className="p-3 text-left">Reg No</th>
            <th className="p-3 text-left">Student</th>
            <th className="p-3 text-left">Father Name</th>
            <th className="p-3 text-center text-green-600">Present</th>
            <th className="p-3 text-center text-red-600">Absent</th>
            <th className="p-3 text-center text-yellow-600">Leave</th>
          </tr>
        </thead>

        <tbody className="text-sm">
          {students.map((s, idx) => (
            <tr key={s.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{idx + 1}</td>
              <td className="p-3">{s.roll_no}</td>
              <td className="p-3">{s.student_name}</td>
              <td className="p-3">{s.father_name || "John"}</td>

              {["Present", "Absent", "Leave"].map((status) => (
                <td key={status} className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={attendance[s.id] === status}
                    onChange={() =>
                      setAttendance({ ...attendance, [s.id]: status })
                    }
                    className="w-4 h-4 accent-purple-600"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* SAVE BUTTON */}
    <button
      className="bg-purple-600 text-white px-6 py-2 rounded-md mt-4"
      onClick={saveAttendance}
    >
      Save Attendance
    </button>
  </div>
);

}
