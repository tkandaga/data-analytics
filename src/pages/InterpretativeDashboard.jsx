import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, FileText, LayoutDashboard, Sparkles } from "lucide-react";
import ResearchSidebar from "@/components/interpretative/ResearchSidebar";
import MetricRow from "@/components/interpretative/MetricRow";
import DescriptiveTable from "@/components/interpretative/DescriptiveTable";
import DistributionHistogram from "@/components/interpretative/DistributionHistogram";
import NormalityPanel from "@/components/statistics/NormalityPanel";
import GroupComparisonPanel from "@/components/statistics/GroupComparisonPanel";
import CorrelationPanel from "@/components/statistics/CorrelationPanel";
import HomogeneityPanel from "@/components/statistics/HomogeneityPanel";
import MeanTestPanel from "@/components/statistics/MeanTestPanel";
import InstrumentPanel from "@/components/statistics/InstrumentPanel";
import RelationshipScatter from "@/components/interpretative/RelationshipScatter";
import CategoryDonut from "@/components/interpretative/CategoryDonut";
import LatestRecords from "@/components/interpretative/LatestRecords";
import RecordsTable from "@/components/interpretative/RecordsTable";
import KeyInterpretations from "@/components/interpretative/KeyInterpretations";
import InsightCard from "@/components/interpretative/InsightCard";
import ReportView from "@/components/interpretative/ReportView";
import { buildAnalysis } from "@/lib/interpretative";
import { loadStudio } from "@/lib/studio";

export default function InterpretativeDashboard() {
  const [dataset] = useState(() => loadStudio().dataset);
  const [view, setView] = useState("overview");
  const [activeNav, setActiveNav] = useState("overview");

  const analysis = useMemo(() => buildAnalysis(dataset), [dataset]);

  const goTo = (id) => {
    setActiveNav(id);
    setView("overview");
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const toggleView = () => {
    setView((v) => (v === "report" ? "overview" : "report"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#F1F0FF] via-[#F8F7FF] to-[#EEF2FF]"
      style={{ "--accent": "#8B5CF6", "--accent-soft": "#E9E6FF", "--accent-ink": "#1E1B4B" }}
    >
      <div className="grid lg:grid-cols-[236px_minmax(0,1fr)]">
        <ResearchSidebar dataset={dataset} activeId={view === "report" ? "laporan" : activeNav} onNavigate={goTo} />

        <main className="min-w-0">
          <header
            className="relative overflow-hidden px-5 py-6 sm:px-7"
            style={{
              background:
                "radial-gradient(circle at 86% -20%, rgba(139,92,246,0.55) 0%, transparent 55%), linear-gradient(115deg, #1E1B4B 0%, #312E81 55%, #4C1D95 100%)",
            }}
          >
            <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white ring-1 ring-inset ring-white/20">
                  <Sparkles className="h-3 w-3" /> Interpretative Dashboard
                </span>
                <h1 className="mt-2.5 text-xl font-extrabold uppercase tracking-tight text-white sm:text-2xl">
                  Interpretative Dashboard
                </h1>
                <p className="mt-1 max-w-xl text-[12.5px] text-white/70">
                  Dari data riset menjadi grafik, tabel, dan interpretasi yang siap dimasukkan ke laporan.
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#22C55E] px-3 py-1.5 text-[10.5px] font-extrabold text-white shadow-sm">
                  <BadgeCheck className="h-3.5 w-3.5" /> Siap untuk Laporan Riset
                </span>
                <Link
                  to="/"
                  className="rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-[11.5px] font-bold text-white transition hover:bg-white hover:text-[#1E1B4B]"
                >
                  Unggah data lain
                </Link>
              </div>
            </div>
          </header>

          <div className="border-b border-[#E6E4F5] bg-white/70 px-5 py-3 backdrop-blur sm:px-7">
            <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-3">
              <button
                onClick={toggleView}
                className="inline-flex items-center gap-2 rounded-xl bg-[#FACC15] px-4 py-2.5 text-[12px] font-extrabold text-[#1E1B4B] shadow-[0_10px_24px_-14px_rgba(250,204,21,0.95)] transition hover:bg-[#FDE047]"
              >
                {view === "report" ? (
                  <>
                    <LayoutDashboard className="h-4 w-4" /> Kembali ke Dashboard
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" /> Tampilkan Research Insights
                  </>
                )}
              </button>
              <span className="text-[11px] text-[#6B7280]">
                {view === "report"
                  ? "Halaman laporan: narasi, temuan, dan tabel ringkasan."
                  : "Halaman utama: ringkasan visual dan interpretasi data."}
              </span>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-5 pb-12 pt-5 sm:px-7">
            {view === "report" ? (
              <ReportView analysis={analysis} onBack={() => { setView("overview"); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
            ) : (
              <>
                <section id="overview" className="scroll-mt-4">
                  <MetricRow analysis={analysis} />
                </section>

                <section id="deskriptif" className="min-w-0 scroll-mt-4">
                  <DescriptiveTable analysis={analysis} />
                </section>

                <section id="distribusi" className="grid scroll-mt-4 items-stretch gap-4 xl:grid-cols-12">
                  <div className="flex min-w-0 flex-col xl:col-span-7">
                    <DistributionHistogram analysis={analysis} />
                  </div>
                  <div className="flex min-w-0 flex-col xl:col-span-5">
                    <CategoryDonut analysis={analysis} />
                  </div>
                </section>

                <section id="normalitas" className="min-w-0 scroll-mt-4">
                  <NormalityPanel analysis={analysis} />
                </section>

                <section id="perbandingan" className="grid scroll-mt-4 items-stretch gap-4 xl:grid-cols-12">
                  <div className="flex min-w-0 flex-col xl:col-span-7">
                    <GroupComparisonPanel analysis={analysis} />
                  </div>
                  <div className="flex min-w-0 flex-col xl:col-span-5">
                    <LatestRecords analysis={analysis} />
                  </div>
                </section>

                <section id="korelasi" className="min-w-0 scroll-mt-4">
                  <CorrelationPanel analysis={analysis} />
                </section>

                <section id="relasi" className="grid scroll-mt-4 items-stretch gap-4 xl:grid-cols-12">
                  <div className="flex min-w-0 flex-col xl:col-span-7">
                    <RelationshipScatter analysis={analysis} />
                  </div>
                  <div className="flex min-w-0 flex-col xl:col-span-5">
                    <RecordsTable analysis={analysis} />
                  </div>
                </section>

                <section id="homogenitas" className="min-w-0 scroll-mt-4">
                  <HomogeneityPanel analysis={analysis} />
                </section>

                <section id="ujibeda" className="min-w-0 scroll-mt-4">
                  <MeanTestPanel analysis={analysis} />
                </section>

                <section id="instrumen" className="min-w-0 scroll-mt-4">
                  <InstrumentPanel analysis={analysis} />
                </section>

                <section id="interpretasi" className="min-w-0 scroll-mt-4">
                  <KeyInterpretations findings={analysis.findings} />
                </section>

                <section id="laporan" className="grid scroll-mt-4 items-stretch gap-4 xl:grid-cols-12">
                  <div className="flex min-w-0 flex-col xl:col-span-5">
                    <InsightCard onOpen={toggleView} />
                  </div>
                  <div className="flex min-w-0 flex-col xl:col-span-7">
                    <div className="flex h-full flex-col justify-center rounded-2xl border border-[#E6E4F5] bg-white/85 p-5">
                      <h2 className="text-[13.5px] font-extrabold text-[#1E1B4B]">Ringkasan dataset</h2>
                      <p className="mt-1 text-[11.5px] leading-relaxed text-[#3F3D56]">
                        {dataset.name} · {dataset.rows.length} baris · {dataset.columns.length} kolom. Ukuran utama{" "}
                        <span className="font-bold text-[#4C1D95]">{analysis.measureLabel}</span>, dimensi pembanding{" "}
                        <span className="font-bold text-[#4C1D95]">{analysis.dimLabel}</span>.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#EDE9FE] px-2.5 py-1 text-[10.5px] font-bold text-[#6D28D9]">
                          Narasi otomatis
                        </span>
                        <span className="rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[10.5px] font-bold text-[#15803D]">
                          Interpretasi berbasis bukti
                        </span>
                        <span className="rounded-full bg-[#E0E7FF] px-2.5 py-1 text-[10.5px] font-bold text-[#3B5BDB]">
                          Tabel siap laporan
                        </span>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}