import React from "react";

export default function MiniStat({ label, value, hint }) {
  return (
    <div className="rounded-lg border border-[#E9E6FB] bg-[#FBFAFF] px-3 py-2">
      <div className="text-[9.5px] font-bold uppercase tracking-[0.06em] text-[#8B87A8]">{label}</div>
      <div className="mt-0.5 text-[13px] font-extrabold text-[#1E1B4B]">{value}</div>
      {hint ? <div className="text-[9.5px] text-[#8B87A8]">{hint}</div> : null}
    </div>
  );
}