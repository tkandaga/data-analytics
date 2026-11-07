import React from "react";

export default function TestSelect({ label, value, onChange, options }) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7C7A9C]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full truncate rounded-lg border border-[#DFE4F7] bg-white px-2.5 py-2 text-[11.5px] font-semibold text-[#1E1B4B] outline-none focus:border-[#8B5CF6]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}