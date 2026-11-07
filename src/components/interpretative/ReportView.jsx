import React from "react";
import ReportHeader from "@/components/interpretative/ReportHeader";
import ReportNarrative from "@/components/interpretative/ReportNarrative";
import ReportSummary from "@/components/interpretative/ReportSummary";
import ReportConclusion from "@/components/interpretative/ReportConclusion";

export default function ReportView({ analysis, onBack }) {
  return (
    <div className="flex flex-col gap-4">
      <ReportHeader analysis={analysis} />
      <ReportNarrative analysis={analysis} />
      <ReportSummary analysis={analysis} />
      <ReportConclusion analysis={analysis} onBack={onBack} />
    </div>
  );
}