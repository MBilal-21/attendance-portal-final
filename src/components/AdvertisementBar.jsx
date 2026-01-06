"use client";

import Image from "next/image";
import { FaTimes, FaBullhorn } from "react-icons/fa";

export default function AdvertisementBar({ open, setOpen }) {
  return (
    <aside
      className={`fixed top-[85px] right-0 h-screen w-72 bg-white border-l shadow-xl z-50
        transform transition-transform duration-500
        ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <FaBullhorn className="text-indigo-600" />
          Advertisements
        </h3>
        <button onClick={() => setOpen(false)}>
          <FaTimes className="text-gray-500 hover:text-red-500" />
        </button>
      </div>

      {/* ADS LIST */}
      <div className="p-4 space-y-6 overflow-y-auto h-full pb-20">

        {/* AD 1 */}
        <AdCard
          title="Smart Attendance System"
          desc="Automate attendance with secure role-based access."
          img="/assets/ad1.png"
        />

        {/* AD 2 */}
        <AdCard
          title="University ERP Solution"
          desc="Integrated student, teacher & admin management."
          img="/assets/ad2.webp"
        />
        {/* AD 1 */}
        <AdCard
          title="Smart Attendance System"
          desc="Automate attendance with secure role-based access."
          img="/assets/ad1.png"
        />

        {/* AD 2 */}
        <AdCard
          title="University ERP Solution"
          desc="Integrated student, teacher & admin management."
          img="/assets/ad2.webp"
        />
        {/* AD 1 */}
        <AdCard
          title="Smart Attendance System"
          desc="Automate attendance with secure role-based access."
          img="/assets/ad1.png"
        />

        {/* AD 2 */}
        <AdCard
          title="University ERP Solution"
          desc="Integrated student, teacher & admin management."
          img="/assets/ad2.webp"
        />
        {/* AD 1 */}
        <AdCard
          title="Smart Attendance System"
          desc="Automate attendance with secure role-based access."
          img="/assets/ad1.png"
        />

        {/* AD 2 */}
        <AdCard
          title="University ERP Solution"
          desc="Integrated student, teacher & admin management."
          img="/assets/ad2.webp"
        />
        {/* AD 1 */}
        <AdCard
          title="Smart Attendance System"
          desc="Automate attendance with secure role-based access."
          img="/assets/ad1.png"
        />

        {/* AD 2 */}
        <AdCard
          title="University ERP Solution"
          desc="Integrated student, teacher & admin management."
          img="/assets/ad2.webp"
        />

      </div>
    </aside>
  );
}

function AdCard({ title, desc, img }) {
  return (
    <div className="border rounded-lg p-3 hover:shadow-lg transition">
      <div className="overflow-hidden rounded-md">
        <Image
          src={img}
          alt={title}
          width={300}
          height={200}
          className="transition-transform duration-500 hover:scale-110"
        />
      </div>
      <h4 className="font-semibold mt-3 text-sm">{title}</h4>
      <p className="text-xs text-gray-600 mt-1">{desc}</p>
    </div>
  );
}
