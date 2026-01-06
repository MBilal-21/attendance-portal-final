"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditStudentPage({ params }) {
  const router = useRouter();

  // FIX: unwrap params (because params is a Promise)
  const { id } = React.use(params);

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    class_id: "",
    roll_no: "",
    password: ""
  });

  // Load user data
  useEffect(() => {
    if (!id) return;

    async function loadUser() {
      const res = await fetch(`/api/admin/users/${id}`);
      const data = await res.json();

      setForm({
        id: data.user_id,
        name: data.name,
        email: data.email,
        class_id: data.class_id,
        roll_no: data.roll_no,
        password: ""
      });

      setLoading(false);
    }

    loadUser();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/admin/users/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    alert("Updated!");
    router.push("/admin/students");
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Edit Student</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          type="text"
          value={form.name}
          placeholder="Name"
          className="w-full p-2 border"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="email"
          value={form.email}
          placeholder="Email"
          className="w-full p-2 border"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="text"
          value={form.roll_no}
          placeholder="Roll No"
          className="w-full p-2 border"
          onChange={(e) => setForm({ ...form, roll_no: e.target.value })}
        />

        <input
          type="number"
          value={form.class_id}
          placeholder="Class ID"
          className="w-full p-2 border"
          onChange={(e) => setForm({ ...form, class_id: e.target.value })}
        />

        <input
          type="password"
          placeholder="New Password (optional)"
          className="w-full p-2 border"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}
