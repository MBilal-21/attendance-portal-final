"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";

import {
  FiMenu,
  FiX,
  FiHome,
  FiCalendar,
  FiUsers,
  FiUserPlus,
  FiBook,
  FiLayers,
  FiRepeat,
} from "react-icons/fi";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  const NavLink = ({ href, icon: Icon, label }) => (
    <Link
      href={href}
      onClick={() => setOpen(false)}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-gray-700 transition"
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
        {/* LOGO */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <Link href="/">
            <Image src="/logo2.svg" alt="Smart School" width={130} height={40} />
          </Link>
          <button
            className="lg:hidden text-gray-600"
            onClick={() => setOpen(false)}
          >
            <FiX size={22} />
          </button>
        </div>

        {/* NAV */}
        <nav className="p-4 space-y-1 text-sm font-medium">
          <NavLink href="/admin" icon={FiHome} label="Dashboard" />
          <NavLink href="/admin/attendance" icon={FiCalendar} label="Attendance" />
          <NavLink href="/admin/users/add" icon={FiUserPlus} label="Add Student / Teacher" />
          <NavLink href="/admin/students" icon={FiUsers} label="Students" />
          <NavLink href="/admin/teachers" icon={FiUsers} label="Teachers" />
          <NavLink href="#" icon={FiBook} label="Programs" />
          <NavLink href="#" icon={FiLayers} label="Classes" />
          <NavLink href="#" icon={FiBook} label="Subjects" />
          <NavLink href="#" icon={FiRepeat} label="Assign Teacher" />
          {/* <NavLink href="/admin/programs" icon={FiBook} label="Programs" />
          <NavLink href="/admin/classes" icon={FiLayers} label="Classes" />
          <NavLink href="/admin/subjects" icon={FiBook} label="Subjects" />
          <NavLink href="/admin/assign" icon={FiRepeat} label="Assign Teacher" /> */}

          <div className="mt-6 pt-4 border-t text-xs text-gray-500">
            Dark Mode (Coming Soon)
          </div>

          <div className="mt-3">
            <LogoutButton />
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* MOBILE TOP BAR */}
        <header className="lg:hidden flex items-center gap-3 bg-white border-b p-4 shrink-0">
          <button onClick={() => setOpen(true)}>
            <FiMenu size={22} />
          </button>
          <span className="font-semibold text-gray-800">Admin Panel</span>
        </header>

        {/* PAGE CONTENT SCROLLS */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
