import React from "react";

export default function Panel({ title, sub, right, tone = "light", children, className = "" }) {
  const accent = tone === "accent";
  return (
    <section className={`overflow-hidden rounded-2xl border border-[#DFE4F7] bg-white shadow-[0_1px_0_rgba(23,37,75,0.03)] ${className}`}>
      <div
        className={`flex flex-wrap items-center gap-2.5 border-b px-5 py-3.5 ${
          accent
            ? "border-transparent bg-[var(--accent)] text-white"
            : "border-[#DFE4F7] text-[var(--accent-ink)]"
        }`}
      >
        {!accent && <span className="h-3 w-3 shrink-0 rounded-[3px] bg-[#FFBD18]" />}
        <h2 className="text-[15px] font-bold leading-tight">{title}</h2>
        {sub ? (
          <span className={`text-xs font-medium ${accent ? "text-white/75" : "text-[#7B8794]"}`}>{sub}</span>
        ) : null}
        {right ? <div className="ml-auto">{right}</div> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}