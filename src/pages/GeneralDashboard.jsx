import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import GeneralSidebar from "@/components/general/GeneralSidebar";
import GeneralKpi from "@/components/general/GeneralKpi";
import TrendChart from "@/components/general/TrendChart";
import DistributionChart from "@/components/general/DistributionChart";
import CategoryBars from "@/components/general/CategoryBars";
import TopRows from "@/components/general/TopRows";
import StatsTable from "@/components/general/StatsTable";
import InsightsPanel from "@/components/general/InsightsPanel";
import {
  buildGroups,
  buildInsights,
  chooseKeys,
  countOutliers,
  describeValues,
  profileColumns,
  toNumber,
} from "@/lib/general";
import { parseCSV } from "@/lib/modeling";
import { loadStudio, saveStudio, themeById } from "@/lib/studio";

export default function GeneralDashboard() {
  const initial = useMemo(() => loadStudio(), []);
  const [dataset, setDataset] = useState(initial.dataset);
  const [themeId] = useState(initial.themeId);
  const [dimKey, setDimKey] = useState("");
  const [measureKey, setMeasureKey] = useState("");
  const [agg, setAgg] = useState("sum");
  const [sort, setSort] = useState("desc");
  const [topN, setTopN] = useState(8);
  const [chartType, setChartType] = useState("line");

  const theme = themeById(themeId);
  const profiles = useMemo(() => profileColumns(dataset), [dataset]);
  const defaults = useMemo(() => chooseKeys(profiles), [profiles]);

  const activeDimKey = profiles.some((p) => p.key === dimKey) ? dimKey : defaults.dimKey;
  const activeMeasureKey = profiles.some((p) => p.key === measureKey) ? measureKey : defaults.measureKey;

  const groups = useMemo(
    () => buildGroups(dataset, profiles, { dimKey: activeDimKey, measureKey: activeMeasureKey, agg, sort }),
    [dataset, profiles, activeDimKey, activeMeasureKey, agg, sort]
  );

  const dimension = profiles.find((p) => p.key === activeDimKey);
  const measure = profiles.find((p) => p.key === activeMeasureKey);
  const stats = measure?.numeric ? describeValues(measure.values) : null;
  const outliers = measure?.numeric ? countOutliers(measure.values) : 0;

  const insights = useMemo(
    () => buildInsights({ profiles, groups, stats, outliers, totalRows: dataset.rows.length }),
    [profiles, groups, stats, outliers, dataset.rows.length]
  );

  const topRows = useMemo(() => {
    if (!measure?.numeric) return [];
    const valueOf = (row) => toNumber(row[activeMeasureKey]);
    const sorted = [...dataset.rows]
      .filter((row) => valueOf(row) !== null)
      .sort((a, b) => valueOf(b) - valueOf(a))
      .slice(0, 5);
    const total = dataset.rows.reduce((acc, row) => acc + (valueOf(row) || 0), 0);
    return sorted.map((row) => {
      const value = valueOf(row);
      return {
        label: row[activeDimKey] === null || row[activeDimKey] === undefined ? "–" : String(row[activeDimKey]),
        value,
        share: total > 0 ? value / total : 0,
      };
    });
  }, [dataset.rows, activeDimKey, activeMeasureKey, measure]);

  const handleUpload = async (file) => {
    try {
      const parsed = parseCSV(await file.text());
      const next = { name: file.name, ...parsed };
      const nextProfiles = profileColumns(next);
      const keys = chooseKeys(nextProfiles);
      setDataset(next);
      setDimKey(keys.dimKey);
      setMeasureKey(keys.measureKey);
      saveStudio({ dataset: next });
    } catch (err) {
      alert(err.message || "File CSV tidak dapat dibaca.");
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F4F6FF]"
      style={{ "--accent": theme.accent, "--accent-soft": theme.soft, "--accent-ink": theme.ink }}
    >
      <div className="grid lg:grid-cols-[268px_minmax(0,1fr)]">
        <GeneralSidebar
          dataset={dataset}
          profiles={profiles}
          dimKey={activeDimKey}
          onDimChange={setDimKey}
          measureKey={activeMeasureKey}
          onMeasureChange={setMeasureKey}
          sort={sort}
          onSortChange={setSort}
          topN={topN}
          onTopNChange={setTopN}
          chartType={chartType}
          onChartTypeChange={setChartType}
          onUpload={handleUpload}
        />

        <main className="min-w-0">
          <header className="border-b border-[#E9ECF8] bg-white/70 px-5 py-5 backdrop-blur sm:px-7">
            <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-start justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--accent-ink)]">
                  <Sparkles className="h-3 w-3" /> General Dashboard
                </span>
                <h1 className="mt-2.5 text-xl font-extrabold uppercase tracking-tight text-[#17254B] sm:text-2xl">
                  Data Analytics Dashboard
                </h1>
                <p className="mt-1 text-[12.5px] text-[#697695]">
                  Ringkasan umum: tren, distribusi, peringkat, dan statistik deskriptif data Anda.
                </p>
              </div>
              <Link
                to="/"
                className="rounded-lg border border-[#E4E8F6] bg-white px-3 py-2 text-[11.5px] font-bold text-[#17254B] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                Unggah data lain
              </Link>
            </div>
          </header>

          <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-5 pb-12 pt-5 sm:px-7">
            <GeneralKpi
              rows={dataset.rows.length}
              stats={stats}
              uniqueGroups={dimension?.unique ?? null}
              measureLabel={measure?.label || ""}
              dimLabel={dimension?.label || ""}
              unit={measure?.unit || ""}
            />

            <div className="grid items-stretch gap-4 xl:grid-cols-12">
              <div className="flex min-w-0 flex-col xl:col-span-8">
                <TrendChart groups={groups} chartType={chartType} agg={agg} onAggChange={setAgg} />
              </div>
              <div className="flex min-w-0 flex-col xl:col-span-4">
                <DistributionChart groups={groups} topN={6} />
              </div>
            </div>

            <div className="grid items-start gap-4 xl:grid-cols-12">
              <div className="flex min-w-0 flex-col xl:col-span-7">
                <CategoryBars groups={groups} topN={topN} />
              </div>
              <div className="flex min-w-0 flex-col xl:col-span-5">
                <TopRows
                  rows={topRows}
                  dimLabel={dimension?.label || ""}
                  measureLabel={measure?.label || ""}
                  unit={measure?.unit || ""}
                />
              </div>
            </div>

            <div className="grid items-start gap-4 xl:grid-cols-12">
              <div className="flex min-w-0 flex-col xl:col-span-8">
                <StatsTable profiles={profiles} />
              </div>
              <div className="flex min-w-0 flex-col xl:col-span-4">
                <InsightsPanel insights={insights} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}