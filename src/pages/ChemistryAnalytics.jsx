import React from "react";

export default function ChemistryAnalytics() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[#1A59A0] text-white flex items-center justify-center font-extrabold text-lg shadow-[3px_3px_0_#FFC82D]">
            C
          </div>
          <h1 className="text-2xl font-bold text-[#1A59A0]">Chemistry Data Analytics</h1>
        </div>
        <p className="text-slate-500 mb-6">
          Dashboard pembelajaran STEM Kimia: dari data eksperimen menuju wawasan matematis.
          File mandiri (HTML + CSS + JS) — bisa diunduh dan dibuka langsung di Chrome/Edge tanpa internet.
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          <a
            href="/chemistry-data-analytics.html"
            download
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1A59A0] text-white font-semibold hover:bg-[#143e6e] transition"
          >
            ⬇ Unduh File HTML
          </a>
          <a
            href="/chemistry-data-analytics.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FFC82D] text-black font-semibold hover:bg-[#e6b827] transition"
          >
            ↗ Buka di Tab Baru
          </a>
        </div>

        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <iframe
            src="/chemistry-data-analytics.html"
            title="Chemistry Data Analytics"
            className="w-full"
            style={{ height: "80vh", border: "none" }}
          />
        </div>

        <p className="text-xs text-slate-400 mt-4">
          Catatan: untuk pengalaman penuh (interaksi tabel, unggah CSV, ekspor), gunakan tombol unduh atau buka di tab baru.
        </p>
      </div>
    </div>
  );
}