import { toNumber } from "@/lib/general";

const EPS = 1e-12;
const LANCZOS = [
  0.99999999999980993,
  676.5203681218851,
  -1259.1392167224028,
  771.32342877765313,
  -176.61502916214059,
  12.507343278686905,
  -0.13857109526572012,
  9.9843695780195716e-6,
  1.5056327351493116e-7,
];

/* ---------- basic summaries ---------- */

export function mean(values) {
  const v = values.filter((n) => Number.isFinite(n));
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : NaN;
}

export function variance(values) {
  const v = values.filter((n) => Number.isFinite(n));
  if (v.length < 2) return NaN;
  const m = mean(v);
  return v.reduce((a, b) => a + (b - m) ** 2, 0) / (v.length - 1);
}

export function stdDev(values) {
  return Math.sqrt(variance(values));
}

export function median(values) {
  const v = values.filter((n) => Number.isFinite(n)).slice().sort((a, b) => a - b);
  if (!v.length) return NaN;
  const n = v.length;
  return n % 2 ? v[(n - 1) / 2] : (v[n / 2 - 1] + v[n / 2]) / 2;
}

export function quantile(values, q) {
  const v = values.filter((n) => Number.isFinite(n)).slice().sort((a, b) => a - b);
  if (!v.length) return NaN;
  const pos = (v.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  const next = v[Math.min(base + 1, v.length - 1)];
  return v[base] + (next - v[base]) * rest;
}

export function skewness(values) {
  const v = values.filter((n) => Number.isFinite(n));
  const n = v.length;
  if (n < 4) return NaN;
  const m = mean(v);
  const s = stdDev(v);
  if (!s) return NaN;
  const m3 = v.reduce((a, x) => a + ((x - m) / s) ** 3, 0);
  return (n / ((n - 1) * (n - 2))) * m3;
}

export function kurtosis(values) {
  const v = values.filter((n) => Number.isFinite(n));
  const n = v.length;
  if (n < 4) return NaN;
  const m = mean(v);
  const s = stdDev(v);
  if (!s) return NaN;
  const g2 = v.reduce((a, x) => a + ((x - m) / s) ** 4, 0) / n - 3;
  return (((n - 1) * ((n + 1) * g2 + 6)) / ((n - 2) * (n - 3)));
}

export function distributionStats(values) {
  const v = values.filter((n) => Number.isFinite(n)).slice().sort((a, b) => a - b);
  if (v.length < 3) return null;
  const q1 = quantile(v, 0.25);
  const q3 = quantile(v, 0.75);
  const iqr = q3 - q1;
  const lowFence = q1 - 1.5 * iqr;
  const highFence = q3 + 1.5 * iqr;
  const inside = v.filter((x) => x >= lowFence && x <= highFence);
  return {
    n: v.length,
    mean: mean(v),
    sd: stdDev(v),
    median: quantile(v, 0.5),
    q1,
    q3,
    iqr,
    min: v[0],
    max: v[v.length - 1],
    lowerWhisker: inside.length ? inside[0] : v[0],
    upperWhisker: inside.length ? inside[inside.length - 1] : v[v.length - 1],
    outliers: v.filter((x) => x < lowFence || x > highFence),
    skew: skewness(v),
    kurt: kurtosis(v),
  };
}

/* ---------- distributions ---------- */

function logGamma(x) {
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  const z = x - 1;
  let a = LANCZOS[0];
  const t = z + 7.5;
  for (let i = 1; i < 9; i += 1) a += LANCZOS[i] / (z + i);
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
}

function betacf(a, b, x) {
  const FPMIN = 1e-300;
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 300; m += 1) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 3e-12) break;
  }
  return h;
}

export function betaInc(a, b, x) {
  if (!Number.isFinite(x) || x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  if (x < (a + 1) / (a + b + 2)) return (bt * betacf(a, b, x)) / a;
  return 1 - (bt * betacf(b, a, 1 - x)) / b;
}

function gser(a, x) {
  let ap = a;
  let sum = 1 / a;
  let del = sum;
  for (let n = 1; n <= 500; n += 1) {
    ap += 1;
    del *= x / ap;
    sum += del;
    if (Math.abs(del) < Math.abs(sum) * 1e-14) break;
  }
  return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
}

function gcf(a, x) {
  const FPMIN = 1e-300;
  let b = x + 1 - a;
  let c = 1 / FPMIN;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i <= 500; i += 1) {
    const an = (-i * (i - a)) / 1;
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = b + an / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 1e-14) break;
  }
  return Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
}

export function chiSqUpper(x, df) {
  if (!Number.isFinite(x) || x <= 0) return 1;
  const a = df / 2;
  const xx = x / 2;
  return xx < a + 1 ? 1 - gser(a, xx) : gcf(a, xx);
}

export function normalPdf(z) {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
}

export function normalCdf(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const poly =
    t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const p = 1 - normalPdf(z) * poly;
  return z >= 0 ? p : 1 - p;
}

export function tTwoSidedP(t, df) {
  if (!Number.isFinite(t) || !Number.isFinite(df) || df <= 0) return NaN;
  return betaInc(df / 2, 0.5, df / (df + t * t));
}

export function fUpperP(f, df1, df2) {
  if (!Number.isFinite(f) || f <= 0) return 1;
  return betaInc(df2 / 2, df1 / 2, df2 / (df2 + df1 * f));
}

export function fmtP(p) {
  if (!Number.isFinite(p)) return "–";
  if (p < 0.001) return "< 0,001";
  return p.toLocaleString("id-ID", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
}

/* ---------- normality ---------- */

function kolmogorovP(d, n) {
  const lam = (Math.sqrt(n) + 0.12 + 0.11 / Math.sqrt(n)) * d;
  if (lam < 0.1) return 1;
  let sum = 0;
  for (let k = 1; k <= 100; k += 1) {
    const term = 2 * Math.pow(-1, k - 1) * Math.exp(-2 * k * k * lam * lam);
    sum += term;
    if (Math.abs(term) < 1e-10) break;
  }
  return Math.min(1, Math.max(0, sum));
}

export function ksTest(values) {
  const v = values.filter((n) => Number.isFinite(n)).slice().sort((a, b) => a - b);
  const n = v.length;
  if (n < 4) return null;
  const m = mean(v);
  const s = stdDev(v);
  if (!s) return null;
  let d = 0;
  v.forEach((x, i) => {
    const f = normalCdf((x - m) / s);
    d = Math.max(d, (i + 1) / n - f, f - i / n);
  });
  return { n, mean: m, sd: s, d, p: kolmogorovP(d, n), critical: 1.36 / Math.sqrt(n) };
}

export function jarqueBera(values) {
  const v = values.filter((n) => Number.isFinite(n));
  const n = v.length;
  if (n < 8) return null;
  const m = mean(v);
  const s = stdDev(v);
  if (!s) return null;
  const m3 = v.reduce((a, x) => a + ((x - m) / s) ** 3, 0) / n;
  const m4 = v.reduce((a, x) => a + ((x - m) / s) ** 4, 0) / n;
  const jb = (n / 6) * (m3 ** 2 + (m4 - 3) ** 2 / 4);
  return { jb, p: chiSqUpper(jb, 2) };
}

/* ---------- correlation ---------- */

function rankValues(values) {
  const idx = values.map((x, i) => ({ x, i })).sort((a, b) => a.x - b.x);
  const ranks = new Array(values.length);
  let i = 0;
  while (i < idx.length) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1].x === idx[i].x) j += 1;
    const r = (i + j) / 2 + 1;
    for (let k = i; k <= j; k += 1) ranks[idx[k].i] = r;
    i = j + 1;
  }
  return ranks;
}

export function pearsonTest(xs, ys) {
  const pairs = [];
  for (let i = 0; i < Math.min(xs.length, ys.length); i += 1) {
    if (Number.isFinite(xs[i]) && Number.isFinite(ys[i])) pairs.push([xs[i], ys[i]]);
  }
  const n = pairs.length;
  if (n < 3) return null;
  const mx = mean(pairs.map((p) => p[0]));
  const my = mean(pairs.map((p) => p[1]));
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  pairs.forEach(([x, y]) => {
    sxy += (x - mx) * (y - my);
    sxx += (x - mx) ** 2;
    syy += (y - my) ** 2;
  });
  if (!sxx || !syy) return null;
  const r = sxy / Math.sqrt(sxx * syy);
  const t = r * Math.sqrt((n - 2) / Math.max(EPS, 1 - r * r));
  return { r, n, t, p: tTwoSidedP(t, n - 2) };
}

export function spearmanTest(xs, ys) {
  const pairs = [];
  for (let i = 0; i < Math.min(xs.length, ys.length); i += 1) {
    if (Number.isFinite(xs[i]) && Number.isFinite(ys[i])) pairs.push([xs[i], ys[i]]);
  }
  const n = pairs.length;
  if (n < 4) return null;
  const base = pearsonTest(
    rankValues(pairs.map((p) => p[0])),
    rankValues(pairs.map((p) => p[1]))
  );
  if (!base) return null;
  return { rho: base.r, n, p: base.p };
}

export function correlationMatrix(dataset, profiles, method = "pearson") {
  const cols = profiles.slice(0, 8);
  const cells = cols.map((a) =>
    cols.map((b) => {
      if (a.key === b.key) return { r: 1, p: 0 };
      const xs = dataset.rows.map((row) => toNumber(row[a.key]));
      const ys = dataset.rows.map((row) => toNumber(row[b.key]));
      const res = method === "spearman" ? spearmanTest(xs, ys) : pearsonTest(xs, ys);
      return res ? { r: res.r ?? res.rho, p: res.p } : { r: NaN, p: NaN };
    })
  );
  return { cols, cells };
}

/* ---------- groups ---------- */

export function groupSeries(dataset, dimKey, measureKey, limit = 12) {
  const map = new Map();
  dataset.rows.forEach((row) => {
    const raw = row[dimKey];
    if (raw === null || raw === undefined || raw === "") return;
    const value = toNumber(row[measureKey]);
    if (value === null) return;
    const name = String(raw);
    if (!map.has(name)) map.set(name, []);
    map.get(name).push(value);
  });
  return [...map.entries()]
    .map(([name, values]) => ({ name, values }))
    .sort((a, b) => b.values.length - a.values.length)
    .slice(0, limit);
}

/* ---------- variance tests ---------- */

export function leveneTest(groups) {
  const gs = groups.filter((g) => g.values.length >= 2);
  const k = gs.length;
  const N = gs.reduce((a, g) => a + g.values.length, 0);
  if (k < 2 || N - k < 1) return null;
  const z = gs.map((g) => g.values.map((v) => Math.abs(v - median(g.values))));
  const gm = mean(z.flat());
  let ssb = 0;
  let ssw = 0;
  z.forEach((zz) => {
    const zm = mean(zz);
    ssb += zz.length * (zm - gm) ** 2;
    ssw += zz.reduce((a, x) => a + (x - zm) ** 2, 0);
  });
  if (!ssw) return null;
  const df1 = k - 1;
  const df2 = N - k;
  const W = ((N - k) / (k - 1)) * (ssb / ssw);
  return { k, N, W, df1, df2, p: fUpperP(W, df1, df2) };
}

export function bartlettTest(groups) {
  const gs = groups.filter((g) => g.values.length >= 2);
  const k = gs.length;
  const N = gs.reduce((a, g) => a + g.values.length, 0);
  if (k < 2 || N - k < 1) return null;
  const vars = gs.map((g) => variance(g.values));
  if (vars.some((v) => !Number.isFinite(v) || v <= 0)) return null;
  const sp2 = gs.reduce((a, g, i) => a + (g.values.length - 1) * vars[i], 0) / (N - k);
  const num =
    (N - k) * Math.log(sp2) - gs.reduce((a, g, i) => a + (g.values.length - 1) * Math.log(vars[i]), 0);
  const c =
    1 + (gs.reduce((a, g) => a + 1 / (g.values.length - 1), 0) - 1 / (N - k)) / (3 * (k - 1));
  const chi2 = num / c;
  return { k, N, chi2, df: k - 1, p: chiSqUpper(chi2, k - 1) };
}

/* ---------- mean difference ---------- */

export function welchTTest(a, b) {
  const va = a.filter((n) => Number.isFinite(n));
  const vb = b.filter((n) => Number.isFinite(n));
  if (va.length < 2 || vb.length < 2) return null;
  const ma = mean(va);
  const mb = mean(vb);
  const sa2 = variance(va);
  const sb2 = variance(vb);
  const sea = sa2 / va.length;
  const seb = sb2 / vb.length;
  const se = Math.sqrt(sea + seb);
  if (!se) return null;
  const t = (ma - mb) / se;
  const df = (sea + seb) ** 2 / (sea ** 2 / (va.length - 1) + seb ** 2 / (vb.length - 1));
  const sp = Math.sqrt(((va.length - 1) * sa2 + (vb.length - 1) * sb2) / (va.length + vb.length - 2));
  return {
    t,
    df,
    p: tTwoSidedP(t, df),
    meanA: ma,
    meanB: mb,
    sdA: Math.sqrt(sa2),
    sdB: Math.sqrt(sb2),
    nA: va.length,
    nB: vb.length,
    diff: ma - mb,
    d: sp ? (ma - mb) / sp : NaN,
  };
}

export function mannWhitneyTest(a, b) {
  const va = a.filter((n) => Number.isFinite(n));
  const vb = b.filter((n) => Number.isFinite(n));
  const na = va.length;
  const nb = vb.length;
  if (na < 2 || nb < 2) return null;
  const all = [...va.map((v) => ({ v, g: 0 })), ...vb.map((v) => ({ v, g: 1 }))];
  const ranks = rankValues(all.map((o) => o.v));
  const counts = new Map();
  all.forEach((o) => counts.set(o.v, (counts.get(o.v) || 0) + 1));
  let tieSum = 0;
  counts.forEach((c) => {
    tieSum += c ** 3 - c;
  });
  let rankSumA = 0;
  all.forEach((o, i) => {
    if (o.g === 0) rankSumA += ranks[i];
  });
  const n = na + nb;
  const uA = rankSumA - (na * (na + 1)) / 2;
  const uB = na * nb - uA;
  const u = Math.min(uA, uB);
  const mu = (na * nb) / 2;
  const sigma = Math.sqrt(((na * nb) / 12) * (n + 1 - tieSum / (n * (n - 1))));
  if (!sigma) return null;
  const z = (u - mu + 0.5) / sigma;
  const p = 2 * (1 - normalCdf(Math.abs(z)));
  const rankSumTotal = (n * (n + 1)) / 2;
  return {
    u: uA,
    uB,
    z,
    p: Math.min(1, Math.max(0, p)),
    nA: na,
    nB: nb,
    meanRankA: rankSumA / na,
    meanRankB: (rankSumTotal - rankSumA) / nb,
    r: Math.abs(z) / Math.sqrt(n),
  };
}

/* ---------- instrument quality ---------- */

export function itemAnalysis(dataset, itemKeys, maxMode = "auto") {
  if (!itemKeys.length) return null;
  const complete = dataset.rows
    .map((row) => itemKeys.map((k) => toNumber(row[k])))
    .filter((r) => r.every((v) => v !== null));
  if (complete.length < 4) return null;

  const k = itemKeys.length;
  const totals = complete.map((r) => r.reduce((a, b) => a + b, 0));
  const totalVar = variance(totals);
  const itemVars = itemKeys.map((_, j) => variance(complete.map((r) => r[j])));
  const alpha =
    k > 1 && totalVar ? (k / (k - 1)) * (1 - itemVars.reduce((a, b) => a + b, 0) / totalVar) : NaN;

  const sortedTotals = [...totals].sort((a, b) => b - a);
  const cut = Math.max(1, Math.ceil(complete.length * 0.27));
  const upper = new Set(sortedTotals.slice(0, cut));
  const lower = new Set(sortedTotals.slice(-cut));

  const items = itemKeys.map((key, j) => {
    const scores = complete.map((r) => r[j]);
    const itemMean = mean(scores);
    const observedMax = Math.max(...scores);
    const max = maxMode === "auto" ? observedMax || 1 : Number(maxMode) || 1;
    const rest = complete.map((r, i) => totals[i] - r[j]);
    const rit = pearsonTest(scores, rest);
    const up = [];
    const low = [];
    complete.forEach((r, i) => {
      if (upper.has(totals[i])) up.push(r[j]);
      if (lower.has(totals[i])) low.push(r[j]);
    });
    const pUp = up.length ? mean(up) / max : NaN;
    const pLow = low.length ? mean(low) / max : NaN;
    const d = pUp - pLow;
    return {
      key,
      mean: itemMean,
      max,
      p: itemMean / max,
      d,
      rit: rit ? rit.r : NaN,
      ritP: rit ? rit.p : NaN,
    };
  });

  return { k, n: complete.length, alpha, items, cut };
}

/* ---------- labels ---------- */

export function strengthLabel(r) {
  const a = Math.abs(r);
  if (!Number.isFinite(a)) return "tidak dapat dihitung";
  if (a >= 0.8) return "sangat kuat";
  if (a >= 0.6) return "kuat";
  if (a >= 0.4) return "sedang";
  if (a >= 0.2) return "lemah";
  return "sangat lemah";
}

export function effectLabel(d) {
  const a = Math.abs(d);
  if (!Number.isFinite(a)) return "tidak dapat dihitung";
  if (a >= 0.8) return "besar";
  if (a >= 0.5) return "sedang";
  if (a >= 0.2) return "kecil";
  return "sangat kecil";
}

export function difficultyLabel(p) {
  if (!Number.isFinite(p)) return "–";
  if (p < 0.3) return "sukar";
  if (p <= 0.7) return "sedang";
  return "mudah";
}

export function discriminationLabel(d) {
  if (!Number.isFinite(d)) return "–";
  if (d >= 0.4) return "baik sekali";
  if (d >= 0.3) return "baik";
  if (d >= 0.2) return "cukup";
  return "jelek";
}

export function reliabilityLabel(alpha) {
  if (!Number.isFinite(alpha)) return "–";
  if (alpha >= 0.8) return "sangat tinggi";
  if (alpha >= 0.7) return "tinggi";
  if (alpha >= 0.6) return "cukup";
  return "rendah";
}