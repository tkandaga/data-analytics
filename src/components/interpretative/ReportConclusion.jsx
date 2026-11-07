import React from "react";
import { ArrowLeft, Quote } from "lucide-react";
import { conclusionInterpretation } from "@/lib/interpretationText";

export default function ReportConclusion({ analysis, onBack }) {
  const { report } = analysis;
  const paragraphs = conclusionInterpretation(analysis);

  return (
    <section className="rounded-2xl border border-[#E6E4F5] bg-gradient-to-br from-white via-[#FBFAFF] to-[#F3F1FF] p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EDE9FE] text-[#7C3AED]">
          <Quote className="h-3.5 w-3.5" />
        </span>
        <h3 className="text-[12.5px] font-extrabold uppercase tracking-[0.06em] text-[#1E1B4B]">Kesimpulan</h3>
      </div>
      <div className="mt-2.5 space-y-2.5">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-[12px] leading-[1.8] text-[#3F3D56]">
            {paragraph}
          </p>
        ))}
      </div>
      <blockquote className="mt-3 rounded-xl border-l-[3px] border-[#8B5CF6] bg-white px-3.5 py-3 text-[11.5px] font-medium italic leading-relaxed text-[#4C1D95]">
        {report.conclusion.quote}
      </blockquote>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-[#EDE9FE] px-3 py-1.5 text-[10.5px] font-bold text-[#6D28D9]">
          Research Implications
        </span>
        <span className="rounded-full bg-[#DCFCE7] px-3 py-1.5 text-[10.5px] font-bold text-[#15803D]">
          Evidence-Based Interpretation
        </span>
        <span className="rounded-full bg-[#E0E7FF] px-3 py-1.5 text-[10.5px] font-bold text-[#3B5BDB]">
          Report-Ready Narrative
        </span>
        <button
          onClick={onBack}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[#DDD6FE] bg-white px-3 py-1.5 text-[10.5px] font-extrabold text-[#4C1D95] transition hover:border-[#8B5CF6]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke dashboard
        </button>
      </div>
    </section>
  );
}