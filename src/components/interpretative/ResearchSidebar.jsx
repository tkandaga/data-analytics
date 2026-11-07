import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  ArrowLeftRight,
  BarChart3,
  ClipboardCheck,
  FileText,
  GitCompare,
  Layers,
  PieChart,
  ScatterChart,
  Sparkles,
  Table2,
  TrendingUp,
} from "lucide-react";

export const NAV = [
  { id: "overview", label: "Ikhtisar", icon: BarChart3 },
  { id: "deskriptif", label: "Statistik", icon: Table2 },
  { id: "distribusi", label: "Distribusi", icon: PieChart },
  { id: "normalitas", label: "Normalitas", icon: Activity },
  { id: "perbandingan", label: "Perbandingan", icon: GitCompare },
  { id: "korelasi", label: "Korelasi", icon: TrendingUp },
  { id: "relasi", label: "Relasi", icon: ScatterChart },
  { id: "homogenitas", label: "Homogenitas", icon: Layers },
  { id: "ujibeda", label: "Uji Beda", icon: ArrowLeftRight },
  { id: "instrumen", label: "Instrumen", icon: ClipboardCheck },
  { id: "interpretasi", label: "Interpretasi", icon: Sparkles },
  { id: "laporan", label: "Laporan", icon: FileText },
];

export default function ResearchSidebar({ dataset, activeId, onNavigate }) {
  return (
    <aside className="flex flex-col bg-gradient-to-b from-[#1E1B4B] via-[#272361] to-[#312E81] text-[#E7E9FF] lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8B5CF6] text-white">
          <BarChart3 className="h-4 w-4" />
        </span>
        <div>
          <div className="text-[13px] font-extrabold leading-tight">Research Analytics</div>
          <div className="text-[10px] font-semibold text-white/60">Interpretative Dashboard</div>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="truncate text-[11.5px] font-bold text-white">{dataset.name}</div>
          <div className="mt-1 text-[10.5px] text-[#A9B2E6]">
            {dataset.rows.length} baris · {dataset.columns.length} kolom
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 px-2.5 py-4">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold transition ${
                active ? "bg-[#8B5CF6] text-white shadow-sm" : "text-[#C7CBF5] hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pb-5 pt-2">
        <Link
          to="/"
          className="flex items-center justify-center gap-1.5 rounded-lg border border-white/15 py-2 text-[11.5px] font-bold text-[#C7CBF5] transition hover:border-white/40 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Pengaturan awal
        </Link>
      </div>
    </aside>
  );
}