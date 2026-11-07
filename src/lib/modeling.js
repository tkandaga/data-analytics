export const EPS = 1.0;

export function num(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}
export function f3(v) {
  return Number.isFinite(v) ? Number(v).toFixed(3) : "–";
}
export function f4(v) {
  return Number.isFinite(v) ? Number(v).toFixed(4) : "–";
}

export const DEFAULT_COLUMNS = [
  { key: "time_s", label: "time_s", unit: "s" },
  { key: "volume_ml", label: "volume_ml", unit: "mL" },
  { key: "temp_c", label: "temp_c", unit: "°C" },
  { key: "foam_height_cm", label: "foam_height_cm", unit: "cm" },
];

const SERIES = [
  [0, 0.0], [5, 3.3], [10, 5.9], [15, 8.1], [20, 9.9], [25, 11.6], [30, 12.9],
  [35, 13.9], [40, 14.8], [45, 15.5], [50, 16.2], [55, 16.6], [60, 17.0],
  [65, 17.3], [70, 17.6], [80, 17.9], [90, 18.1],
];

export const DEFAULT_ROWS = SERIES.map(([t, h]) => ({
  time_s: t,
  volume_ml: 200,
  temp_c: 25,
  foam_height_cm: h,
}));

export const MODELS = {
  asym: {
    name: "Eksponensial",
    f: (x, p) => p[0] + p[1] * (1 - Math.exp(-p[2] * x)),
    params: [
      {
        sym: "c",
        label: "c — offset",
        init: (c) => c.minY,
        lo: (c) => c.minY - c.rangeY,
        hi: (c) => c.minY + c.rangeY,
        step: (c) => Math.max(c.rangeY / 200, 1e-6),
      },
      {
        sym: "H",
        label: "H — amplitudo",
        init: (c) => c.rangeY,
        lo: (c) => Math.max(c.rangeY * 0.05, 1e-4),
        hi: (c) => c.rangeY * 2,
        step: (c) => Math.max(c.rangeY / 200, 1e-6),
      },
      {
        sym: "k",
        label: "k — laju kenaikan",
        init: (c) => 3 / Math.max(c.rangeX, 1),
        lo: () => 0.0001,
        hi: () => 5,
        step: () => 0.0001,
      },
    ],
    eq: (p) =>
      "ŷ = " + f3(p[0]) + " + " + f4(p[1]) + "(1 − e<sup>−" + f4(p[2]) + "x</sup>)",
  },
  expo: {
    name: "Eksponensial Murni",
    f: (x, p) => p[0] * Math.exp(p[1] * x),
    params: [
      {
        sym: "a",
        label: "a — skala",
        init: (c) => Math.max(c.maxY, 1e-3),
        lo: (c) => Math.max(c.rangeY * 0.01, 1e-4),
        hi: (c) => c.rangeY * 4,
        step: (c) => Math.max(c.rangeY / 200, 1e-6),
      },
      {
        sym: "b",
        label: "b — laju",
        init: (c) => 1 / Math.max(c.rangeX, 1),
        lo: (c) => -5 / Math.max(c.rangeX, 1),
        hi: (c) => 5 / Math.max(c.rangeX, 1),
        step: (c) => Math.max(0.05 / Math.max(c.rangeX, 1), 1e-6),
      },
    ],
    eq: (p) => "ŷ = " + f4(p[0]) + " · e<sup>" + f4(p[1]) + "x</sup>",
  },
  linear: {
    name: "Linear",
    f: (x, p) => p[0] + p[1] * x,
    params: [
      {
        sym: "a",
        label: "a — intersep",
        init: (c) => c.meanY,
        lo: (c) => c.minY - c.rangeY,
        hi: (c) => c.maxY + c.rangeY,
        step: (c) => Math.max(c.rangeY / 200, 1e-6),
      },
      {
        sym: "b",
        label: "b — kemiringan",
        init: (c) => c.rangeY / Math.max(c.rangeX, 1),
        lo: (c) => (-5 * c.rangeY) / Math.max(c.rangeX, 1),
        hi: (c) => (5 * c.rangeY) / Math.max(c.rangeX, 1),
        step: (c) => Math.max(c.rangeY / Math.max(c.rangeX, 1) / 200, 1e-6),
      },
    ],
    eq: (p) => "ŷ = " + f3(p[0]) + " + " + f4(p[1]) + "x",
  },
  quad: {
    name: "Polinomial Kuadratik",
    f: (x, p) => p[0] + p[1] * x + p[2] * x * x,
    params: [
      {
        sym: "a",
        label: "a — konstanta",
        init: (c) => c.meanY,
        lo: (c) => c.minY - c.rangeY,
        hi: (c) => c.maxY + c.rangeY,
        step: (c) => Math.max(c.rangeY / 200, 1e-6),
      },
      {
        sym: "b",
        label: "b — linear",
        init: (c) => c.rangeY / Math.max(c.rangeX, 1),
        lo: (c) => (-5 * c.rangeY) / Math.max(c.rangeX, 1),
        hi: (c) => (5 * c.rangeY) / Math.max(c.rangeX, 1),
        step: (c) => Math.max(c.rangeY / Math.max(c.rangeX, 1) / 200, 1e-6),
      },
      {
        sym: "c",
        label: "c — kuadratik",
        init: (c) => c.rangeY / Math.max(c.rangeX * c.rangeX, 1e-3) / 20,
        lo: (c) => (-2 * c.rangeY) / Math.max(c.rangeX * c.rangeX, 1e-3),
        hi: (c) => (2 * c.rangeY) / Math.max(c.rangeX * c.rangeX, 1e-3),
        step: (c) => Math.max(c.rangeY / Math.max(c.rangeX * c.rangeX, 1e-3) / 200, 1e-8),
      },
    ],
    eq: (p) => "ŷ = " + f3(p[0]) + " + " + f4(p[1]) + "x + " + f4(p[2]) + "x²",
  },
  log: {
    name: "Logaritmik",
    f: (x, p) => p[0] + p[1] * Math.log(x + 1),
    params: [
      {
        sym: "a",
        label: "a — konstanta",
        init: (c) => c.minY,
        lo: (c) => c.minY - c.rangeY,
        hi: (c) => c.maxY + c.rangeY,
        step: (c) => Math.max(c.rangeY / 200, 1e-6),
      },
      {
        sym: "b",
        label: "b — koefisien log",
        init: (c) => c.rangeY / Math.log(Math.max(c.rangeX, 1) + 1),
        lo: (c) => (-5 * c.rangeY) / Math.max(Math.log(Math.max(c.rangeX, 1) + 1), 1e-3),
        hi: (c) => (5 * c.rangeY) / Math.max(Math.log(Math.max(c.rangeX, 1) + 1), 1e-3),
        step: (c) => Math.max(c.rangeY / Math.max(Math.log(Math.max(c.rangeX, 1) + 1), 1e-3) / 200, 1e-6),
      },
    ],
    eq: (p) => "ŷ = " + f3(p[0]) + " + " + f4(p[1]) + " · ln(x + 1)",
  },
};

export function extractPoints(rows, xKey, yKey) {
  return rows.map((row, i) => {
    const x = num(row[xKey]);
    const y = num(row[yKey]);
    return { i, x, y, valid: x !== null && y !== null };
  });
}

export function describeCtx(points) {
  const valid = points.filter((p) => p.valid);
  if (!valid.length) {
    return { minX: 0, maxX: 1, minY: 0, maxY: 1, rangeX: 1, rangeY: 1, meanY: 0 };
  }
  const xs = valid.map((p) => p.x);
  const ys = valid.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return {
    minX,
    maxX,
    minY,
    maxY,
    rangeX: Math.max(maxX - minX, 1e-6),
    rangeY: Math.max(maxY - minY, 1e-6),
    meanY: ys.reduce((a, b) => a + b, 0) / ys.length,
  };
}

export function initParams(modelId, ctx) {
  return MODELS[modelId].params.map((p) => {
    const v = p.init(ctx);
    return Number.isFinite(v) ? v : 0;
  });
}

export function sseFor(model, pts, p) {
  let s = 0;
  for (const pt of pts) {
    const yh = model.f(pt.x, p);
    if (!Number.isFinite(yh)) return Infinity;
    const d = pt.y - yh;
    s += d * d;
  }
  return s;
}

export function nelderMead(fn, x0, steps, iters) {
  const n = x0.length;
  let simplex = [x0.slice()];
  for (let i = 0; i < n; i++) {
    const p = x0.slice();
    p[i] += steps[i] || 0.1;
    simplex.push(p);
  }
  let vals = simplex.map(fn);

  for (let it = 0; it < iters; it++) {
    const order = vals.map((_, k) => k).sort((a, b) => vals[a] - vals[b]);
    simplex = order.map((k) => simplex[k]);
    vals = order.map((k) => vals[k]);
    if (!Number.isFinite(vals[0])) break;
    if (Math.abs(vals[n] - vals[0]) < 1e-12) break;

    const centroid = new Array(n).fill(0);
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let i = 0; i < n; i++) s += simplex[i][j];
      centroid[j] = s / n;
    }
    const reflect = centroid.map((c, j) => c + (c - simplex[n][j]));
    const fr = fn(reflect);

    if (fr < vals[0]) {
      const expand = centroid.map((c, j) => c + 2 * (c - simplex[n][j]));
      const fe = fn(expand);
      if (fe < fr) {
        simplex[n] = expand;
        vals[n] = fe;
      } else {
        simplex[n] = reflect;
        vals[n] = fr;
      }
    } else if (fr < vals[n - 1]) {
      simplex[n] = reflect;
      vals[n] = fr;
    } else {
      const contract = centroid.map((c, j) => c + 0.5 * (simplex[n][j] - c));
      const fc = fn(contract);
      if (fc < vals[n]) {
        simplex[n] = contract;
        vals[n] = fc;
      } else {
        for (let i = 1; i <= n; i++) {
          for (let j = 0; j < n; j++) {
            simplex[i][j] = simplex[0][j] + 0.5 * (simplex[i][j] - simplex[0][j]);
          }
          vals[i] = fn(simplex[i]);
        }
      }
    }
  }
  let best = 0;
  for (let i = 1; i <= n; i++) if (vals[i] < vals[best]) best = i;
  return simplex[best];
}

export function fitParams(modelId, points, ctx, range) {
  const model = MODELS[modelId];
  const pts = points.filter((p) => p.valid && p.x >= range[0] && p.x <= range[1]);
  const lo = model.params.map((p) => p.lo(ctx));
  const hi = model.params.map((p) => p.hi(ctx));
  let start = model.params.map((p, i) => {
    const v = p.init(ctx);
    const safe = Number.isFinite(v) ? v : 0;
    return Math.min(hi[i], Math.max(lo[i], safe));
  });
  if (pts.length < 2) return start;
  const steps = start.map((v, i) => Math.max(Math.abs(v) * 0.2, (hi[i] - lo[i]) / 100, 1e-6));
  const best = nelderMead((p) => sseFor(model, pts, p), start.slice(), steps, 1200);
  const fitted = best.map((v, i) =>
    Number.isFinite(v) ? Math.min(hi[i], Math.max(lo[i], v)) : start[i]
  );
  return sseFor(model, pts, fitted) <= sseFor(model, pts, start) ? fitted : start;
}

export function curvePoints(modelId, params, xmin, xmax, count = 160) {
  const model = MODELS[modelId];
  const out = [];
  for (let i = 0; i <= count; i++) {
    const x = xmin + ((xmax - xmin) * i) / count;
    const y = model.f(x, params);
    if (Number.isFinite(y)) out.push({ x, y });
  }
  return out;
}

export function analyze(modelId, params, points, range) {
  const model = MODELS[modelId];
  const cells = points.map((p) => {
    if (!p.valid) return { ...p, yh: null, res: null, inRange: false };
    const inRange = p.x >= range[0] && p.x <= range[1];
    const yh = model.f(p.x, params);
    const ok = Number.isFinite(yh);
    return { ...p, yh: ok ? yh : null, res: ok ? p.y - yh : null, inRange };
  });
  const used = cells.filter((c) => c.valid && c.inRange && c.res !== null);
  const n = used.length;
  let mean = 0;
  let sse = 0;
  let sst = 0;
  let within = 0;
  let maxY = 0;
  let maxPred = 0;
  let minY = Infinity;
  used.forEach((c) => {
    mean += c.y;
  });
  if (n) mean /= n;
  used.forEach((c) => {
    sse += c.res * c.res;
    sst += (c.y - mean) * (c.y - mean);
    if (Math.abs(c.res) <= EPS) within++;
    if (c.y > maxY) maxY = c.y;
    if (c.y < minY) minY = c.y;
    if (c.yh > maxPred) maxPred = c.yh;
  });
  if (minY === Infinity) minY = 0;
  const r2 = n ? (sst > 0 ? 1 - sse / sst : sse === 0 ? 1 : 0) : 0;
  const rmse = n ? Math.sqrt(sse / n) : 0;
  return {
    cells,
    used,
    n,
    r2,
    rmse,
    within,
    tolPct: n ? (100 * within) / n : 0,
    maxY,
    maxPred,
    minY,
  };
}

export function feasibility(r2) {
  if (!Number.isFinite(r2) || r2 === 0) return { text: "–", tone: "text-[#7B8794]" };
  if (r2 >= 0.95) return { text: "Sangat Baik", tone: "text-[#178D65]" };
  if (r2 >= 0.85) return { text: "Baik", tone: "text-[#1C69C6]" };
  if (r2 >= 0.7) return { text: "Cukup", tone: "text-[#D36A2B]" };
  return { text: "Kurang", tone: "text-[#C0392B]" };
}

export function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim() !== "");
  if (!lines.length) throw new Error("File CSV kosong.");

  const semi = (lines[0].match(/;/g) || []).length;
  const comma = (lines[0].match(/,/g) || []).length;
  const tab = (lines[0].match(/\t/g) || []).length;
  let delim = ",";
  if (tab > comma && tab >= semi) delim = "\t";
  else if (semi > comma) delim = ";";

  const splitLine = (line) => {
    if (delim !== ",") {
      return line.split(delim).map((c) => c.trim().replace(/^"|"$/g, ""));
    }
    const out = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line.charAt(i);
      if (ch === '"') {
        inQ = !inQ;
        continue;
      }
      if (ch === "," && !inQ) {
        out.push(cur.trim());
        cur = "";
        continue;
      }
      cur += ch;
    }
    out.push(cur.trim());
    return out;
  };

  const head = splitLine(lines[0]);
  const looksHeader = head.some(
    (h) => h !== "" && !Number.isFinite(parseFloat(String(h).replace(",", ".")))
  );
  const used = new Set();

  const columns = head.map((h, i) => {
    const label = looksHeader && h ? h : `Kolom ${i + 1}`;
    let base = String(label)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    if (!base) base = `kolom_${i + 1}`;
    let key = base;
    let n = 1;
    while (used.has(key)) {
      n++;
      key = `${base}_${n}`;
    }
    used.add(key);
    return { key, label, unit: "" };
  });

  const rows = [];
  for (let li = looksHeader ? 1 : 0; li < lines.length; li++) {
    const vals = splitLine(lines[li]);
    if (!vals.length || vals.every((v) => v === "")) continue;
    const row = {};
    columns.forEach((col, j) => {
      const raw = vals[j];
      if (raw === undefined || raw === "") {
        row[col.key] = null;
        return;
      }
      const n = parseFloat(String(raw).replace(",", "."));
      row[col.key] = Number.isFinite(n) ? n : raw;
    });
    rows.push(row);
  }

  if (!rows.length) throw new Error("Tidak ada baris data yang dapat dibaca.");
  const numeric = columns.filter((c) => rows.some((r) => typeof r[c.key] === "number"));
  if (!numeric.length) throw new Error("File CSV tidak memuat kolom numerik.");

  columns.forEach((c) => {
    c.numeric = numeric.some((n) => n.key === c.key);
  });

  return { columns, rows };
}

export function pickKeys(columns) {
  const numeric = columns.filter((c) => c.numeric !== false);
  const y =
    numeric.find((c) => /foam|height|response|hasil/i.test(c.key)) ||
    numeric[1] ||
    numeric[0];
  const x = numeric.find((c) => c.key !== (y && y.key)) || numeric[0];
  return { xKey: x ? x.key : columns[0].key, yKey: y ? y.key : columns[0].key };
}