import React, { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import MetricCards from "@/components/dashboard/MetricCards";
import ModelChart from "@/components/dashboard/ModelChart";
import ModelSummary from "@/components/dashboard/ModelSummary";
import ResidualChart from "@/components/dashboard/ResidualChart";
import InfoCards from "@/components/dashboard/InfoCards";
import DataTable from "@/components/dashboard/DataTable";
import Interpretation from "@/components/dashboard/Interpretation";
import {
  MODELS,
  analyze,
  describeCtx,
  extractPoints,
  fitParams,
  initParams,
  parseCSV,
  pickKeys,
} from "@/lib/modeling";
import { loadStudio, saveStudio, themeById } from "@/lib/studio";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const SPAN = {
  kpi: "lg:col-span-12",
  chart: "lg:col-span-8",
  model: "lg:col-span-4",
  residual: "lg:col-span-6",
  info: "lg:col-span-6",
  table: "lg:col-span-12",
  interp: "lg:col-span-12",
};

export default function Dashboard() {
  const initial = useMemo(() => loadStudio(), []);
  const [dataset, setDataset] = useState(initial.dataset);
  const [themeId] = useState(initial.themeId);
  const [xKey, setXKey] = useState(initial.xKey);
  const [yKey, setYKey] = useState(initial.yKey);
  const [modelId, setModelId] = useState("asym");
  const [mode, setMode] = useState("best");
  const [visible, setVisible] = useState(initial.visible);
  const [order, setOrder] = useState(initial.order);
  const [range, setRange] = useState(null);
  const [params, setParams] = useState([]);
  const [busy, setBusy] = useState(false);
  const contentRef = useRef(null);

  const theme = themeById(themeId);
  const points = useMemo(() => extractPoints(dataset.rows, xKey, yKey), [dataset.rows, xKey, yKey]);
  const ctx = useMemo(() => describeCtx(points), [points]);
  const bounds = useMemo(() => {
    if (range) return range;
    const valid = points.filter((p) => p.valid);
    if (!valid.length) return { min: 0, max: 1 };
    const xs = valid.map((p) => p.x);
    return { min: Math.min(...xs), max: Math.max(...xs) };
  }, [range, points]);

  useEffect(() => {
    if (mode !== "best") return;
    setParams(fitParams(modelId, points, ctx, [bounds.min, bounds.max]));
  }, [modelId, mode, points, ctx, bounds.min, bounds.max]);

  const modelParams =
    params.length === MODELS[modelId].params.length ? params : initParams(modelId, ctx);

  const stats = useMemo(
    () => analyze(modelId, modelParams, points, [bounds.min, bounds.max]),
    [modelId, modelParams, points, bounds.min, bounds.max]
  );

  useEffect(() => {
    saveStudio({ dataset, themeId, xKey, yKey, visible, order });
  }, [dataset, themeId, xKey, yKey, visible, order]);

  const labelOf = (key) => {
    const c = dataset.columns.find((col) => col.key === key);
    if (!c) return key;
    return c.unit ? `${c.label} (${c.unit})` : c.label;
  };
  const xLabel = labelOf(xKey);
  const yLabel = labelOf(yKey);

  const handleVarChange = (kind, key) => {
    if (kind === "x") {
      setXKey(key);
      setRange(null);
    } else {
      setYKey(key);
    }
  };

  const handleModelChange = (id) => {
    setModelId(id);
    setParams(initParams(id, ctx));
  };

  const handleUpload = async (file) => {
    try {
      const parsed = parseCSV(await file.text());
      const keys = pickKeys(parsed.columns);
      setDataset({ name: file.name, ...parsed });
      setXKey(keys.xKey);
      setYKey(keys.yKey);
      setRange(null);
      setParams([]);
    } catch (err) {
      alert(err.message || "File CSV tidak dapat dibaca.");
    }
  };

  const handleCellChange = (index, key, raw) => {
    const value = raw === "" ? null : Number(raw);
    setDataset((d) => ({
      ...d,
      rows: d.rows.map((row, i) => (i === index ? { ...row, [key]: Number.isFinite(value) ? value : null } : row)),
    }));
  };

  const handleAddRow = () => {
    const row = {};
    dataset.columns.forEach((c) => {
      row[c.key] = null;
    });
    setDataset((d) => ({ ...d, rows: [...d.rows, row] }));
  };

  const handleDeleteRow = (index) => {
    setDataset((d) => ({ ...d, rows: d.rows.filter((_, i) => i !== index) }));
  };

  const exportCSV = () => {
    const header = ["No", labelOf(xKey), labelOf(yKey), "Prediksi", "Residual"].join(",");
    const lines = stats.cells.map((c, i) =>
      [
        i + 1,
        c.x ?? "",
        c.y ?? "",
        c.yh === null ? "" : c.yh.toFixed(6),
        c.res === null ? "" : c.res.toFixed(6),
      ].join(",")
    );
    const blob = new Blob([`\ufeff${[header, ...lines].join("\n")}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modeling_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPNG = async () => {
    if (!contentRef.current) return;
    setBusy(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: "#F8F9FF",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "dashboard-modeling.png";
      a.click();
    } catch {
      alert("Ekspor gambar gagal.");
    } finally {
      setBusy(false);
    }
  };

  const today = new Date();
  const date = `${String(today.getDate()).padStart(2, "0")}-${MONTHS[today.getMonth()]}-${today.getFullYear()}`;

  const sections = {
    kpi: <MetricCards n={stats.n} r2={stats.r2} rmse={stats.rmse} modelName={MODELS[modelId].name} />,
    chart: (
      <ModelChart
        points={points}
        modelId={modelId}
        params={modelParams}
        bounds={bounds}
        xLabel={xLabel}
        yLabel={yLabel}
      />
    ),
    model: (
      <ModelSummary
        modelId={modelId}
        mode={mode}
        params={modelParams}
        ctx={ctx}
        onParamChange={(i, value) => {
          setMode("manual");
          setParams(modelParams.map((v, idx) => (idx === i ? value : v)));
        }}
      />
    ),
    residual: <ResidualChart used={stats.used} xLabel={xLabel} />,
    info: (
      <InfoCards
        date={date}
        tolPct={stats.tolPct}
        n={stats.n}
        r2={stats.r2}
        busy={busy}
        onExcel={exportCSV}
        onPdf={() => window.print()}
        onPng={exportPNG}
      />
    ),
    table: (
      <DataTable
        columns={dataset.columns}
        xKey={xKey}
        yKey={yKey}
        cells={stats.cells}
        xLabel={xLabel}
        yLabel={yLabel}
        onCellChange={handleCellChange}
        onAddRow={handleAddRow}
        onDeleteRow={handleDeleteRow}
        onClear={() => setDataset((d) => ({ ...d, rows: [] }))}
      />
    ),
    interp: (
      <Interpretation modelId={modelId} params={modelParams} stats={stats} xLabel={xLabel} yLabel={yLabel} />
    ),
  };

  const shown = order.filter((id) => visible[id]);

  return (
    <div
      className="min-h-screen bg-[#F8F9FF]"
      style={{ "--accent": theme.accent, "--accent-soft": theme.soft, "--accent-ink": theme.ink }}
    >
      <div className="grid lg:grid-cols-[296px_minmax(0,1fr)]">
        <DashboardSidebar
          dataset={dataset}
          xKey={xKey}
          yKey={yKey}
          onVarChange={handleVarChange}
          bounds={bounds}
          onBoundsChange={setRange}
          modelId={modelId}
          onModelChange={handleModelChange}
          mode={mode}
          onModeChange={setMode}
          onUpload={handleUpload}
          order={order}
          visible={visible}
          onToggle={(id) => setVisible((v) => ({ ...v, [id]: !v[id] }))}
          onReorder={setOrder}
        />

        <main className="min-w-0">
          <header className="relative overflow-hidden px-5 pb-6 pt-9 text-center">
            <div className="pointer-events-none absolute -left-40 -top-72 h-[520px] w-[520px] rounded-full bg-[#EAEBFF]" />
            <div className="pointer-events-none absolute right-8 top-6 hidden h-24 w-32 [background-image:radial-gradient(circle_at_3px_3px,#CBC8EE_3px,transparent_3.2px)] [background-size:22px_22px] md:block" />
            <div className="relative mx-auto w-full max-w-[1200px]">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#17254B] sm:text-3xl">
                Mathematical Modeling Dashboard
              </h1>
              <div className="mx-auto mt-3 flex max-w-md items-center">
                <span className="h-[3px] flex-1 bg-[var(--accent)]" />
                <span className="mx-2 h-4 w-4 rounded-full bg-[var(--accent)]" />
                <span className="h-[3px] flex-1 bg-[var(--accent)]" />
              </div>
              <p className="mt-3 text-sm text-[#697695] sm:text-base">
                Dari Data Menuju Model, Validasi, dan Interpretasi — {dataset.name}
              </p>
            </div>
          </header>

          <div
            ref={contentRef}
            className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-5 pb-12 sm:px-7 lg:grid lg:grid-flow-row-dense lg:grid-cols-12 lg:items-start"
          >
            {shown.length ? (
              shown.map((id) => (
                <div key={id} className={SPAN[id]}>
                  {sections[id]}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#DFE4F7] bg-white py-20 text-center">
                <p className="text-sm text-[#7B8794]">
                  Semua bagian disembunyikan. Aktifkan kembali lewat Preferences di sidebar.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}