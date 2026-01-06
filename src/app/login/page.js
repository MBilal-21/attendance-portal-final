"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notRobot, setNotRobot] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------
  // REDIRECT IF ALREADY LOGGED IN
  // ---------------------------------------------------
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.role === "admin") window.location.href = "/admin";
          else if (data.role === "teacher") window.location.href = "/teacher";
          else if (data.role === "student") window.location.href = "/student";
        }
      } catch (err) {
        // ignore
      }
    }
    checkAuth();
  }, []);

  // ---------------------------------------------------
  // LOGIN HANDLER
  // ---------------------------------------------------
  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!notRobot) {
      setError("Please confirm you are not a robot.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    if (data.role === "admin") window.location.href = "/admin";
    else if (data.role === "teacher") window.location.href = "/teacher";
    else window.location.href = "/student";
  }

  return (
    <div className="min-h-screen w-full bg-[#f4f6ff] flex items-center justify-center px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-between bg-[#6C63FF] p-8 lg:p-12">
          <div className="self-end">
            <Image src="/logo.svg" alt="Logo" width={120} height={120} />
          </div>

          <div className="bg-[#ffffff24] backdrop-blur-md p-6 rounded-md space-y-6">
            <div className="flex justify-center">
              <Image
                src="/assets/loginpic.svg"
                alt="Login Illustration"
                width={350}
                height={350}
              />
            </div>

            <p className="text-white text-center text-lg leading-relaxed">
              “Empowering education through seamless management — your journey
              to smarter school operations starts here.”
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center p-6 sm:p-10">
          <form
            onSubmit={handleLogin}
            className="w-full max-w-sm space-y-6"
            autoComplete="off"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
              <p className="text-sm text-gray-400">
                Welcome back! Please login to your account.
              </p>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-600">User Name</label>
              <input
                type="email"
                inputMode="email"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                placeholder="Enter User Name"
                className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-[#6C63FF]"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-600">Password</label>
                <a
                  href="/forgot-password"
                  className="text-xs text-[#6C63FF] hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter Password"
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg pr-10 focus:ring-2 focus:ring-[#6C63FF]"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* CAPTCHA */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={notRobot}
                onChange={(e) => setNotRobot(e.target.checked)}
                className="w-4 h-4 accent-[#6C63FF]"
              />
              <span className="text-sm text-gray-600">
                I’m not a robot
              </span>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6C63FF] text-white py-2.5 rounded-lg font-semibold hover:bg-[#5a51e6] transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
