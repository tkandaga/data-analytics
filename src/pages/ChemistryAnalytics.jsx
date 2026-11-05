import React from "react";

export default function ChemistryAnalytics() {
  return (
    <div className="relative h-screen w-full bg-white">
      <iframe
        src="/chemistry-data-analytics.html"
        title="Mathematical Modeling Dashboard"
        className="h-full w-full border-0"
      />
      <a
        href="/chemistry-data-analytics.html"
        download
        className="absolute bottom-4 right-4 z-10 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-xs font-semibold text-slate-600 shadow-lg backdrop-blur transition hover:text-slate-900"
      >
        Unduh HTML
      </a>
    </div>
  );
}