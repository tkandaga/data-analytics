import React from "react";

export default function InterpretationBox({ title = "Interpretasi", children }) {
  return (
    <div className="mt-3 rounded-xl border border-[#E9E6FB] bg-[#F7F5FF] px-3.5 py-3">
      <div className="mb-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-[#6D28D9]">{title}</div>
      <div className="space-y-1.5 text-[11.5px] leading-relaxed text-[#3F3D56]">{children}</div>
    </div>
  );
}