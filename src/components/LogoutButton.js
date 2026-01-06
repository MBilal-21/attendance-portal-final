"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      // server clears cookie; navigate to login
      router.push("/login");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-2 text-red-500 text-sm hover:underline disabled:opacity-60"
      disabled={loading}
      type="button"
      style={{textAlign:"left"}}
    >
      {loading ? "Logging out..." : "🚪 Logout"}
    </button>
  );
}