import { DEFAULT_COLUMNS, DEFAULT_ROWS } from "@/lib/modeling";

const KEY = "chem_studio_v1";

export const THEMES = [
  { id: "violet", name: "Violet", accent: "#6430DA", soft: "#F2EDFF", ink: "#4A22B8" },
  { id: "blue", name: "Biru", accent: "#1C69C6", soft: "#E9F3FF", ink: "#155199" },
  { id: "teal", name: "Teal", accent: "#0E9488", soft: "#E6F7F4", ink: "#0B7268" },
  { id: "emerald", name: "Hijau", accent: "#178D65", soft: "#E7F5EE", ink: "#106B4C" },
  { id: "amber", name: "Jingga", accent: "#D36A2B", soft: "#FFF3EB", ink: "#A85320" },
  { id: "rose", name: "Rose", accent: "#C2255C", soft: "#FDECF2", ink: "#96194A" },
  { id: "navy", name: "Navy", accent: "#1B2657", soft: "#EEF1FB", ink: "#141C3D" },
];

export const DASHBOARD_TYPES = [
  {
    id: "modeling",
    name: "Mathematical Modeling",
    desc: "Fitting model matematis pada data, analisis residual, dan interpretasi parameter.",
    ready: true,
  },
  {
    id: "general",
    name: "General Dashboard",
    desc: "Ringkasan statistik deskriptif dan visualisasi tren data secara umum.",
    ready: false,
  },
  {
    id: "interpretative",
    name: "Interpretative Dashboard",
    desc: "Penjelasan naratif otomatis atas pola dan temuan utama dalam data.",
    ready: false,
  },
];

export const SECTIONS = [
  { id: "kpi", label: "Kartu metrik" },
  { id: "chart", label: "Grafik data & model" },
  { id: "model", label: "Ringkasan model" },
  { id: "residual", label: "Residual & toleransi" },
  { id: "info", label: "Kartu info & ekspor" },
  { id: "table", label: "Tabel data" },
  { id: "interp", label: "Interpretasi" },
];

export const SAMPLE_DATASET = {
  name: "Data contoh — pertumbuhan buih",
  columns: DEFAULT_COLUMNS,
  rows: DEFAULT_ROWS,
};

export function defaultState() {
  return {
    dataset: SAMPLE_DATASET,
    themeId: "violet",
    type: "modeling",
    xKey: "time_s",
    yKey: "foam_height_cm",
    visible: SECTIONS.reduce((acc, s) => ({ ...acc, [s.id]: true }), {}),
    order: SECTIONS.map((s) => s.id),
  };
}

export function loadStudio() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

export function saveStudio(patch) {
  try {
    const next = { ...loadStudio(), ...patch };
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
}

export function themeById(id) {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}