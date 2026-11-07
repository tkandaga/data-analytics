import React from "react";
import { ArrowUpRight, FileText } from "lucide-react";

export default function InsightCard({ onOpen }) {
  return (
    <section className="flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-[#312E81] via-[#4C1D95] to-[#1E1B4B] p-5 text-white shadow-[0_18px_40px_-30px_rgba(30,27,75,0.9)]">
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white ring-1 ring-inset ring-white/20">
          <FileText className="h-3 w-3" /> Report-Ready Insight
        </span>
        <h2 className="mt-3 text-[15px] font-extrabold leading-snug">
          Narasi riset siap dilampirkan pada laporan
        </h2>
        <p className="mt-2 text-[11.5px] leading-relaxed text-white/75">
          Grafik, tabel, dan interpretasi disusun otomatis dari data Anda sehingga bisa langsung dimasukkan ke
          bagian hasil dan pembahasan laporan penelitian.
        </p>
      </div>
      <button
        onClick={onOpen}
        className="mt-4 inline-flex items-center justify-center gap-1.5 self-start rounded-lg bg-[#FACC15] px-3 py-2 text-[11.5px] font-extrabold text-[#1E1B4B] transition hover:bg-[#FDE047]"
      >
        Buka Research Insights <ArrowUpRight className="h-3.5 w-3.5" />
      </button>
    </section>
  );
}