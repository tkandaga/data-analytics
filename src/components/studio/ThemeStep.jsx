import React from "react";
import { Check } from "lucide-react";
import { THEMES } from "@/lib/studio";

export default function ThemeStep({ themeId, onSelect }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-[#17254B]">Pilih warna tema</h2>
      <p className="mt-1 text-sm text-[#697695]">Warna ini dipakai pada sidebar, kartu metrik, dan aksen grafik.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((t) => {
          const active = t.id === themeId;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`overflow-hidden rounded-xl border-2 bg-white text-left transition ${
                active ? "border-[#6430DA] shadow-[0_10px_24px_-16px_rgba(100,48,218,0.8)]" : "border-[#E4E8F6] hover:border-[#C9BFF0]"
              }`}
            >
              <div className="flex items-center justify-between px-3 py-2.5 text-xs font-bold text-white" style={{ background: t.accent }}>
                <span>{t.name}</span>
                {active ? <Check className="h-4 w-4" /> : null}
              </div>
              <div className="flex gap-2 p-3" style={{ background: t.soft }}>
                <span className="h-8 w-8 rounded-lg" style={{ background: t.accent }} />
                <span className="h-8 flex-1 rounded-lg bg-white" />
                <span className="h-8 w-10 rounded-lg" style={{ background: t.ink }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}