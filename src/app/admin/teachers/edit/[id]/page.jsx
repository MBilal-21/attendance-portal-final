"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EditTeacherPage() {
  const params = useParams();
  const id = params.id;

  const [teacher, setTeacher] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      const res = await fetch(`/api/admin/users/${id}`);
      const data = await res.json();

      setTeacher({
        user_id: data.user_id,   // ✔ store correctly
        name: data.name,
        email: data.email,
        newPassword: ""
      });
    }
    loadData();
  }, [id]);

  if (!teacher) return <p>Loading teacher details...</p>;

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const payload = {
      id: teacher.user_id,         // ✔ FIXED
      name: teacher.name,
      email: teacher.email,
      password: teacher.newPassword || "",
    };

    const res = await fetch("/api/admin/users/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setMessage(data.error || data.message);
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">

        <h1 className="text-2xl font-bold mb-4">Edit Teacher</h1>

        {message && (
          <div className="p-3 bg-purple-100 text-purple-700 rounded mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input
              className="w-full border p-2 rounded"
              value={teacher.name}
              onChange={(e) =>
                setTeacher({ ...teacher, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              className="w-full border p-2 rounded"
              value={teacher.email}
              onChange={(e) =>
                setTeacher({ ...teacher, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">New Password (optional)</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              placeholder="Leave blank to keep old password"
              onChange={(e) =>
                setTeacher({ ...teacher, newPassword: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
          >
            Save Changes
          </button>

        </form>
      </div>
    </div>
  );
}
