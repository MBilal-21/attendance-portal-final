"use client";

import { useEffect, useState } from "react";
import {
  FiUsers,
  FiEdit3,
  FiTrash2,
  FiSearch,
  FiX,
} from "react-icons/fi";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("all");
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // ----------------------------------
  // LOAD CLASSES (SAME AS ATTENDANCE)
  // ----------------------------------
  useEffect(() => {
    async function loadClasses() {
      const res = await fetch("/api/admin/attendance/classes");
      const data = await res.json();
      setClasses(data);
    }
    loadClasses();
  }, []);

  // ----------------------------------
  // LOAD STUDENTS
  // ----------------------------------
  useEffect(() => {
    async function loadStudents() {
      const res = await fetch("/api/admin/users/list");
      const data = await res.json();
      setStudents(data.filter((u) => u.role === "student"));
    }
    loadStudents();
  }, []);

  // ----------------------------------
  // DELETE STUDENT
  // ----------------------------------
  async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    const res = await fetch("/api/admin/users/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  }

  // ----------------------------------
  // FILTER STUDENTS
  // ----------------------------------
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      `${s.name} ${s.email} ${s.roll_no ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchClass =
      selectedClass === "all" || s.class_id == selectedClass;

    return matchSearch && matchClass;
  });

  // ----------------------------------
  // HELPER: CLASS NAME
  // ----------------------------------
  function getClassName(class_id) {
    return classes.find((c) => c.id == class_id)?.class_name || "—";
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FiUsers /> Students
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Dashboard {" > "} Students
          </p>
        </div>

        <a
          href="/admin/users/add"
          className="bg-purple-600 text-white px-5 py-2 rounded-lg shadow hover:bg-purple-700"
        >
          + Add Student
        </a>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-wrap items-center justify-center gap-4">

        {/* SEARCH */}
        <div className="relative">
          {!searchOpen ? (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 border rounded-lg bg-white shadow"
            >
              <FiSearch />
            </button>
          ) : (
            <div className="relative w-72">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, roll no"
                className="w-full pl-10 pr-10 py-2 border rounded-lg"
              />
              <button
                onClick={() => {
                  setSearch("");
                  setSearchOpen(false);
                }}
                className="absolute right-3 top-3 text-gray-400"
              >
                <FiX />
              </button>
            </div>
          )}
        </div>

        {/* CLASS FILTER (FROM ATTENDANCE LOGIC) */}
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border px-4 py-2 rounded-lg bg-white shadow"
        >
          <option value="all">All Classes</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.class_name}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b text-gray-600">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Class</th>
                <th className="p-3 text-left">Roll No</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => (
                  <tr
                    key={s.id}
                    className={`border-b hover:bg-gray-50 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                    }`}
                  >
                    <td className="p-3">{s.id}</td>
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3 text-gray-600">{s.email}</td>
                    <td className="p-3">{getClassName(s.class_id)}</td>
                    <td className="p-3">{s.roll_no ?? "—"}</td>

                    <td className="p-3 flex justify-center gap-2">
                      <a
                        href={`/admin/students/edit/${s.id}`}
                        className="flex items-center gap-1 bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-200"
                      >
                        <FiEdit3 size={14} />
                        Edit
                      </a>

                      <button
                        onClick={() => deleteUser(s.id)}
                        className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200"
                      >
                        <FiTrash2 size={14} />
                        Delete
                      </button>
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
