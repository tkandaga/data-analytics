import React from "react";
import Panel from "@/components/dashboard/Panel";
import { countWords } from "@/lib/interpretationText";

export default function LongTextCard({ title, sub = "Interpretasi otomatis berbasis data", icon: Icon, paragraphs, tone = "light" }) {
  const words = countWords(paragraphs);
  const accent = tone === "accent";

  return (
    <Panel
      title={title}
      sub={sub}
      tone={tone}
      right={
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-extrabold ${
            accent ? "bg-white/20 text-white" : "bg-[var(--accent-soft)] text-[var(--accent-ink)]"
          }`}
        >
          {Icon ? <Icon className="h-3 w-3" /> : null}
          {words} kata
        </span>
      }
      bodyClassName="px-5 py-4"
    >
      <div className="space-y-3">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-[12.5px] leading-[1.85] text-[#3F3D56]">
            {paragraph}
          </p>
        ))}
      </div>
    </Panel>
  );
}