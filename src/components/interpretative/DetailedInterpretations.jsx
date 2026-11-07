import React, { useMemo } from "react";
import { BarChart3, BadgeCheck, Sparkles, Users } from "lucide-react";
import LongTextCard from "@/components/interpretative/LongTextCard";
import {
  comparisonInterpretation,
  conclusionInterpretation,
  descriptiveInterpretation,
  executiveInterpretation,
} from "@/lib/interpretationText";

export default function DetailedInterpretations({ analysis }) {
  const cards = useMemo(
    () => ({
      executive: executiveInterpretation(analysis),
      descriptive: descriptiveInterpretation(analysis),
      comparison: comparisonInterpretation(analysis),
      conclusion: conclusionInterpretation(analysis),
    }),
    [analysis]
  );

  return (
    <div className="flex flex-col gap-4">
      <LongTextCard
        title="Executive Interpretation"
        sub="Ringkasan temuan utama"
        icon={Sparkles}
        paragraphs={cards.executive}
        tone="accent"
      />

      <div className="grid items-start gap-4 xl:grid-cols-2">
        <LongTextCard
          title="Interpretasi Statistik Deskriptif"
          sub="Pemusatan, keragaman, dan bentuk sebaran"
          icon={BarChart3}
          paragraphs={cards.descriptive}
        />
        <LongTextCard
          title="Interpretasi Perbandingan Kelompok"
          sub="Peringkat dan selisih antar kategori"
          icon={Users}
          paragraphs={cards.comparison}
        />
      </div>

      <LongTextCard title="Kesimpulan" sub="Sintesis temuan dan batas interpretasi" icon={BadgeCheck} paragraphs={cards.conclusion} />
    </div>
  );
}