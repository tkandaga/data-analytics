import React from "react";

const TONES = {
  ok: "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]",
  warn: "bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]",
  bad: "bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]",
  info: "bg-[#EDE9FE] text-[#6D28D9] border-[#DDD6FE]",
};

export default function SigBadge({ tone = "info", children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-extrabold ${TONES[tone] || TONES.info}`}
    >
      {children}
    </span>
  );
}