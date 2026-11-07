import React from "react";
import { Sparkles } from "lucide-react";
import Panel from "@/components/dashboard/Panel";

export default function KeyInterpretations({ findings }) {
  return (
    <Panel
      title="Interpretasi Kunci"
      sub="temuan utama dari data"
      right={
        <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold text-white">
          <Sparkles className="h-3 w-3" /> {findings.length} poin
        </span>
      }
      bodyClassName="pt-3"
    >
      <ol className="flex flex-col gap-2.5">
        {findings.map((text, i) => (
          <li key={text} className="flex gap-2.5 rounded-xl border border-[#EEEBFB] bg-[#FBFAFF] px-3 py-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8B5CF6] text-[10px] font-extrabold text-white">
              {i + 1}
            </span>
            <span className="text-[11.5px] leading-relaxed text-[#3F3D56]">{text}</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}