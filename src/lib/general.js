export const PALETTE = [
  "#6430DA",
  "#1C69C6",
  "#0E9488",
  "#D36A2B",
  "#C2255C",
  "#8B5CF6",
  "#0EA5E9",
  "#14B8A6",
  "#F59E0B",
  "#64748B",
];

export const AGGREGATIONS = [
  { id: "sum", label: "Total" },
  { id: "avg", label: "Rata-rata" },
  { id: "count", label: "Jumlah data" },
  { id: "max", label: "Maks" },
  { id: "min", label: "Min" },
];

export function aggLabel(id) {
  return AGGREGATIONS.find((a) => a.id === id)?.label || id;
}

export function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : parseFloat(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

export function fmtNum(value, digits = 2) {
  if (!Number.isFinite(value)) return "–";
  const abs = Math.abs(value);
  const d = abs >= 10000 ? 0 : abs >= 100 ? 1 : digits;
  return value.toLocaleString("id-ID", { maximumFractionDigits: d });
}

export function fmtCompact(value) {
  if (!Number.isFinite(value)) return "–";
  const abs = Math.abs(value);
  if (abs >= 1e9) return `${(value / 1e9).toLocaleString("id-ID", { maximumFractionDigits: 1 })} M`;
  if (abs >= 1e6) return `${(value / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  if (abs >= 1e4) return `${(value / 1e3).toLocaleString("id-ID", { maximumFractionDigits: 1 })} rb`;
  return fmtNum(value, abs >= 100 ? 1 : 2);
}

export function profileColumns(dataset) {
  return dataset.columns.map((col) => {
    const values = dataset.rows.map((row) => row[col.key]);
    const filled = values.filter((v) => v !== null && v !== undefined && v !== "");
    const numbers = filled.map(toNumber).filter((n) => n !== null);
    const numeric = filled.length > 0 && numbers.length / filled.length >= 0.8;
    return {
      key: col.key,
      label: col.label,
      unit: col.unit || "",
      numeric,
      filled: filled.length,
      missing: values.length - filled.length,
      unique: new Set(filled.map((v) => String(v))).size,
      values: numbers,
    };
  });
}

export function chooseKeys(profiles) {
  const cats = profiles.filter((p) => !p.numeric && p.unique > 1 && p.unique <= 60);
  const nums = profiles.filter((p) => p.numeric);
  const dim = cats[0] || profiles.find((p) => p.unique > 1) || profiles[0] || null;
  const varying = nums.filter((p) => p.values.length > 1 && new Set(p.values).size > 1);
  const measure =
    varying.find((p) => p.key !== dim?.key) || nums.find((p) => p.key !== dim?.key) || nums[0] || profiles[0] || null;
  return { dimKey: dim?.key || "", measureKey: measure?.key || "" };
}

export function describeValues(values) {
  const v = values.filter((n) => Number.isFinite(n)).slice().sort((a, b) => a - b);
  if (!v.length) return null;
  const n = v.length;
  const sum = v.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const median = n % 2 ? v[(n - 1) / 2] : (v[n / 2 - 1] + v[n / 2]) / 2;
  const variance = v.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
  return { n, sum, mean, median, min: v[0], max: v[n - 1], stdev: Math.sqrt(variance) };
}

export function countOutliers(values) {
  const v = values.filter((n) => Number.isFinite(n)).slice().sort((a, b) => a - b);
  if (v.length < 4) return 0;
  const q1 = v[Math.floor(v.length * 0.25)];
  const q3 = v[Math.floor(v.length * 0.75)];
  const iqr = q3 - q1;
  if (!iqr) return 0;
  const lo = q1 - 1.5 * iqr;
  const hi = q3 + 1.5 * iqr;
  return v.filter((x) => x < lo || x > hi).length;
}

export function buildGroups(dataset, profiles, { dimKey, measureKey, agg = "sum", sort = "desc" }) {
  const dim = profiles.find((p) => p.key === dimKey) || profiles[0] || null;
  const measure = profiles.find((p) => p.key === measureKey) || null;
  const effectiveAgg = measure?.numeric ? agg : "count";

  const empty = {
    rows: [],
    total: 0,
    groupCount: 0,
    binned: false,
    dimLabel: dim?.label || "",
    measureLabel: "Jumlah data",
    unit: "",
    agg: effectiveAgg,
  };
  if (!dim) return empty;

  const useBins = dim.numeric && dim.unique > 12 && dim.values.length > 12;
  let low = 0;
  let step = 1;
  if (useBins) {
    low = Math.min(...dim.values);
    const high = Math.max(...dim.values);
    step = (high - low) / 10 || 1;
  }

  const buckets = new Map();
  dataset.rows.forEach((row) => {
    const rawDim = row[dim.key];
    const numDim = toNumber(rawDim);
    let name;
    let order = null;

    if (useBins && numDim !== null) {
      const idx = Math.min(9, Math.max(0, Math.floor((numDim - low) / step)));
      const start = low + idx * step;
      name = `${fmtNum(start, 1)} – ${fmtNum(start + step, 1)}`;
      order = start;
    } else {
      name = rawDim === null || rawDim === undefined || rawDim === "" ? "(kosong)" : String(rawDim);
    }

    const bucket =
      buckets.get(name) || { name, order, count: 0, valid: 0, sum: 0, min: Infinity, max: -Infinity };
    bucket.count += 1;
    const mv = measure ? toNumber(row[measure.key]) : null;
    if (mv !== null) {
      bucket.valid += 1;
      bucket.sum += mv;
      bucket.min = Math.min(bucket.min, mv);
      bucket.max = Math.max(bucket.max, mv);
    }
    buckets.set(name, bucket);
  });

  const rows = [...buckets.values()].map((b) => {
    let value;
    if (effectiveAgg === "count") value = b.count;
    else if (effectiveAgg === "avg") value = b.valid ? b.sum / b.valid : 0;
    else if (effectiveAgg === "max") value = b.valid ? b.max : 0;
    else if (effectiveAgg === "min") value = b.valid ? b.min : 0;
    else value = b.sum;
    return { name: b.name, value, count: b.count, order: b.order };
  });

  if (useBins) rows.sort((a, b) => a.order - b.order);
  else if (sort === "alpha") rows.sort((a, b) => a.name.localeCompare(b.name, "id"));
  else rows.sort((a, b) => (sort === "asc" ? a.value - b.value : b.value - a.value));

  const total = rows.reduce((acc, r) => acc + (Number.isFinite(r.value) ? r.value : 0), 0);

  return {
    rows: rows.map((r) => ({ ...r, share: total > 0 ? r.value / total : 0 })),
    total,
    groupCount: rows.length,
    binned: useBins,
    dimLabel: dim.unit ? `${dim.label} (${dim.unit})` : dim.label,
    measureLabel: effectiveAgg === "count" ? "Jumlah data" : measure?.label || "",
    unit: effectiveAgg === "count" ? "" : measure?.unit || "",
    agg: effectiveAgg,
  };
}

export function buildInsights({ profiles, groups, stats, outliers, totalRows }) {
  const out = [];
  const unit = groups.unit ? ` ${groups.unit}` : "";
  const byValue = [...groups.rows].sort((a, b) => b.value - a.value);
  const top = byValue[0];
  const bottom = byValue[byValue.length - 1];

  if (top && groups.groupCount > 1) {
    out.push({
      kind: "up",
      text: `${aggLabel(groups.agg)} tertinggi pada ${groups.dimLabel}: "${top.name}" sebesar ${fmtNum(top.value)}${unit} (${Math.round(top.share * 100)}% dari total).`,
    });
  }
  if (bottom && groups.groupCount > 1 && bottom.name !== top.name) {
    out.push({
      kind: "down",
      text: `Nilai terendah: "${bottom.name}" dengan ${fmtNum(bottom.value)}${unit}.`,
    });
  }
  if (stats) {
    const skew =
      stats.mean > stats.median * 1.05
        ? "condong ke kanan"
        : stats.median > stats.mean * 1.05
        ? "condong ke kiri"
        : "relatif simetris";
    out.push({
      kind: "avg",
      text: `Rata-rata ${groups.measureLabel} ${fmtNum(stats.mean)}${unit}, median ${fmtNum(stats.median)}${unit} — distribusi ${skew}.`,
    });
    out.push(
      outliers > 0
        ? { kind: "alert", text: `${outliers} nilai berada di luar rentang wajar (1,5 × IQR) dan perlu diperiksa sebagai kemungkinan pencilan.` }
        : { kind: "ok", text: `Tidak ditemukan nilai ekstrem pada kolom ${groups.measureLabel}.` }
    );
  }

  const numericCols = profiles.filter((p) => p.numeric).length;
  out.push({
    kind: "info",
    text: `Dataset berisi ${totalRows} baris dan ${profiles.length} kolom (${numericCols} numerik, ${profiles.length - numericCols} kategorikal).`,
  });

  const missing = profiles.reduce((acc, p) => acc + p.missing, 0);
  if (missing > 0) {
    const pct = totalRows * profiles.length ? Math.round((missing / (totalRows * profiles.length)) * 100) : 0;
    out.push({ kind: "alert", text: `${missing} sel kosong (${pct}% dari keseluruhan data) dihitung sebagai "(kosong)".` });
  }

  return out;
}