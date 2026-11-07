import React from "react";
import { BarChart3, GitCompare, Lightbulb, Trophy } from "lucide-react";
import NarrativeCard from "@/components/interpretative/NarrativeCard";
import DistributionHistogram from "@/components/interpretative/DistributionHistogram";
import RelationshipScatter from "@/components/interpretative/RelationshipScatter";
import StatStack from "@/components/interpretative/StatStack";

export default function ReportNarrative({ analysis }) {
  const { report } = analysis;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-7">
          <NarrativeCard
            title="Executive Interpretation"
            icon={Trophy}
            text={report.executive.text}
            quote={report.executive.quote}
          />
        </div>
        <div className="min-w-0 xl:col-span-5">
          <NarrativeCard
            title="Interpretasi Statistik Deskriptif"
            icon={BarChart3}
            text={report.descriptive.text}
            metrics={report.descriptive.metrics}
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-5">
          <DistributionHistogram analysis={analysis} compact />
        </div>
        <div className="min-w-0 xl:col-span-4">
          <NarrativeCard
            title="Interpretasi Perbandingan Kelompok"
            icon={GitCompare}
            text={report.comparison.text}
            metrics={report.comparison.metrics}
          />
        </div>
        <div className="min-w-0 xl:col-span-3">
          <StatStack analysis={analysis} />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-7">
          <RelationshipScatter analysis={analysis} />
        </div>
        <div className="min-w-0 xl:col-span-5">
          <NarrativeCard
            title="Implikasi Riset"
            icon={Lightbulb}
            text={report.implications.text}
            footer={
              <div className="flex flex-wrap gap-1.5">
                {report.implications.pills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-[#DDD6FE] bg-[#F5F3FF] px-2.5 py-1 text-[10px] font-bold text-[#6D28D9]"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}