"use client";

import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function AddUserPage() {
  const [role, setRole] = useState("student");
  const [classes, setClasses] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    class_id: "",
    roll_no: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    async function loadClasses() {
      const res = await fetch("/api/admin/classes/list");
      const data = await res.json();
      setClasses(data);
    }
    loadClasses();
  }, []);

  function handleChange(field, value) {
    let error = "";

    if (field === "password" && value.length < 6) {
      error = "Password must be at least 6 characters.";
    }

    if ((field === "name" || field === "email") && value.toLowerCase().includes("admin")) {
      error = "Name or email cannot contain 'admin'.";
    }

    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: error });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (errors.name || errors.email || errors.password) {
      setMessage("Please fix the errors before submitting.");
      return;
    }

    const payload = { ...form, role };

    const res = await fetch("/api/admin/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error);
    } else {
      setMessage("User added successfully!");
      setForm({
        name: "",
        email: "",
        password: "",
        class_id: "",
        roll_no: "",
      });
      setErrors({ name: "", email: "", password: "" });
    }
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add New User</h1>

      {message && (
        <div className="p-2 mb-4 text-center text-white bg-blue-600 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Full Name */}
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border p-2 pr-10 rounded"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-600"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className="block mb-1">Role</label>
          <select
            className="w-full border p-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
          </select>
        </div>

        {/* Student Fields */}
        {role === "student" && (
          <>
            <div>
              <label className="block mb-1">Select Class</label>
              <select
                className="w-full border p-2 rounded"
                value={form.class_id}
                onChange={(e) =>
                  setForm({ ...form, class_id: e.target.value })
                }
              >
                <option value="">-- Select Class --</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.program_name} | Semester {c.semester} | {c.section}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1">Roll Number</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={form.roll_no}
                onChange={(e) =>
                  setForm({ ...form, roll_no: e.target.value })
                }
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700"
        >
          Add User
        </button>
      </form>
    </div>
  );
}
