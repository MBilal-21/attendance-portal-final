"use client";

import { useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

import {
  FiMenu,
  FiX,
  FiHome,
  FiCalendar,
  FiUser,
} from "react-icons/fi";

export default function StudentLayout({ children }) {
  const [open, setOpen] = useState(false);

  const NavItem = ({ href, icon: Icon, label }) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-100 hover:text-green-900 transition"
    >
      <Icon size={18} />
      {label}
    </Link>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:static z-40
          h-screen w-64 bg-white border-r
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          overflow-y-auto
        `}
      >
        {/* LOGO / TITLE */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2 text-green-700 font-bold text-lg">
            <FiUser size={20} />
            Student Portal
          </div>

          <button
            className="lg:hidden text-gray-600"
            onClick={() => setOpen(false)}
          >
            <FiX size={22} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="p-4 space-y-1 text-sm font-medium text-gray-700">
          <NavItem href="/student" icon={FiHome} label="Dashboard" />
          <NavItem
            href="/student/attendance"
            icon={FiCalendar}
            label="My Attendance"
          />

          <div className="mt-6 pt-4 border-t">
            <LogoutButton />
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* MOBILE TOP BAR */}
        <header className="lg:hidden flex items-center gap-3 bg-white border-b p-4 shrink-0">
          <button onClick={() => setOpen(true)}>
            <FiMenu size={22} />
          </button>
          <span className="font-semibold text-gray-800">Student Panel</span>
        </header>

        {/* PAGE CONTENT SCROLL */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
