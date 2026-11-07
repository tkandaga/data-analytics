import React, { useState } from "react";
import { AlertCircle, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Panel from "@/components/dashboard/Panel";

const SECTIONS = [
  { key: "executive", title: "Ringkasan Eksekutif" },
  { key: "descriptive", title: "Deskriptif Data" },
  { key: "comparison", title: "Perbandingan Kategori" },
  { key: "relationship", title: "Hubungan Antar Variabel" },
  { key: "conclusion", title: "Kesimpulan dan Saran" },
];

function buildSummary(analysis) {
  const { stats, top, bottom } = analysis;
  return {
    datasetName: analysis.dataset?.name,
    totalRows: analysis.totalRows,
    measureLabel: analysis.measureLabel,
    dimLabel: analysis.dimLabel,
    secondaryLabel: analysis.secondary?.label || null,
    stats: stats
      ? { mean: stats.mean, median: stats.median, stdev: stats.stdev, min: stats.min, max: stats.max }
      : null,
    top: top ? { name: top.name, value: top.value } : null,
    bottom: bottom ? { name: bottom.name, value: bottom.value } : null,
    difference: analysis.difference,
    correlation: analysis.correlation,
    effectSize: analysis.effectSize,
    completeness: analysis.completeness,
    findings: analysis.findings,
  };
}

export default function AINarrative({ analysis }) {
  const [narrative, setNarrative] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await base44.functions.invoke("generateNarrative", { summary: buildSummary(analysis) });
      setNarrative(response.data.narrative);
    } catch (err) {
      setError(err?.response?.data?.error || "Narasi AI gagal dibuat. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Panel
      title="Narasi AI"
      sub="interpretasi otomatis dari AI"
      right={
        <button
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#FACC15] px-3 py-1.5 text-[11px] font-extrabold text-[#1E1B4B] transition hover:bg-[#FDE047] disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Menyusun narasi
            </>
          ) : narrative ? (
            <>
              <RefreshCw className="h-3.5 w-3.5" /> Buat ulang
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" /> Buat narasi AI
            </>
          )}
        </button>
      }
    >
      {error ? (
        <div className="flex items-start gap-2 rounded-xl border border-[#FECDD3] bg-[#FFF1F2] p-3 text-[11.5px] text-[#9F1239]">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {!narrative ? (
        <p className="text-[11.5px] leading-relaxed text-[#4B5563]">
          Tekan tombol di atas untuk menyusun narasi interpretasi dari hasil statistik dashboard ini. Setiap penyusunan
          memakai satu kredit integrasi AI. Angka yang dipakai adalah angka yang sudah terhitung di halaman ini.
        </p>
      ) : (
        <div className="space-y-3.5">
          {SECTIONS.map((section) => {
            const text = narrative[section.key];
            if (!text) return null;
            return (
              <div key={section.key}>
                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#6D28D9]">
                  {section.title}
                </h3>
                <p className="mt-1 text-[12px] font-normal leading-[1.75] text-[#3F3D56]">{text}</p>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}