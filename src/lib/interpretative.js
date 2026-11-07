import { buildGroups, chooseKeys, describeValues, fmtNum, profileColumns, toNumber } from "@/lib/general";

function meanOf(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

export function makeHistogram(values, bins = 8) {
  const v = values.filter((n) => Number.isFinite(n));
  if (!v.length) return [];
  const min = Math.min(...v);
  const max = Math.max(...v);
  const step = (max - min) / bins || 1;
  const counts = Array.from({ length: bins }, () => 0);
  v.forEach((x) => {
    const i = Math.min(bins - 1, Math.max(0, Math.floor((x - min) / step)));
    counts[i] += 1;
  });
  return counts.map((count, i) => ({
    name: `${fmtNum(min + i * step, 1)}–${fmtNum(min + (i + 1) * step, 1)}`,
    mid: min + i * step + step / 2,
    count,
  }));
}

export function pearson(xs, ys) {
  if (xs.length < 3) return null;
  const mx = meanOf(xs);
  const my = meanOf(ys);
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < xs.length; i += 1) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  if (!sxx || !syy) return null;
  return sxy / Math.sqrt(sxx * syy);
}

export function linearFit(xs, ys) {
  if (xs.length < 3) return null;
  const mx = meanOf(xs);
  const my = meanOf(ys);
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < xs.length; i += 1) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
  }
  if (!sxx) return null;
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx };
}

export function strengthOf(r) {
  const a = Math.abs(r);
  if (a >= 0.8) return "sangat kuat";
  if (a >= 0.6) return "kuat";
  if (a >= 0.4) return "sedang";
  if (a >= 0.2) return "lemah";
  return "sangat lemah";
}

export function effectLabel(d) {
  const a = Math.abs(d);
  if (a >= 0.8) return "besar";
  if (a >= 0.5) return "sedang";
  if (a >= 0.2) return "kecil";
  return "sangat kecil";
}

export function buildAnalysis(dataset) {
  const profiles = profileColumns(dataset);
  const keys = chooseKeys(profiles);
  const dim = profiles.find((p) => p.key === keys.dimKey) || profiles[0] || null;
  const numeric = profiles.filter((p) => p.numeric);
  const measure = numeric.find((p) => p.key === keys.measureKey) || numeric[0] || null;
  const secondary = numeric.find((p) => p.key !== measure?.key) || null;
  const stats = measure ? describeValues(measure.values) : null;

  const groups = buildGroups(dataset, profiles, {
    dimKey: dim?.key,
    measureKey: measure?.key,
    agg: "avg",
    sort: "desc",
  });
  const counted = buildGroups(dataset, profiles, {
    dimKey: dim?.key,
    measureKey: measure?.key,
    agg: "count",
    sort: "desc",
  });

  const ranked = [...groups.rows].sort((a, b) => b.value - a.value);
  const comparison = ranked.slice(0, 5);
  const distribution = counted.rows.slice(0, 4);
  const otherCount = counted.rows.slice(4).reduce((acc, r) => acc + r.count, 0);
  const top = ranked[0] || null;
  const bottom = ranked[ranked.length - 1] || null;

  const pairs = [];
  if (measure && secondary) {
    dataset.rows.forEach((row) => {
      const x = toNumber(row[measure.key]);
      const y = toNumber(row[secondary.key]);
      if (x !== null && y !== null) pairs.push([x, y]);
    });
  }
  const xs = pairs.map((p) => p[0]);
  const ys = pairs.map((p) => p[1]);
  const correlation = pearson(xs, ys);
  const fit = linearFit(xs, ys);
  const points = pairs
    .slice(0, 400)
    .map(([x, y]) => ({ x, y, fit: fit ? fit.intercept + fit.slope * x : null }))
    .sort((a, b) => a.x - b.x);

  const hist = measure ? makeHistogram(measure.values, 8) : [];
  const totalRows = dataset.rows.length;
  const totalCells = totalRows * profiles.length;
  const missing = profiles.reduce((acc, p) => acc + p.missing, 0);
  const completeness = totalCells ? ((totalCells - missing) / totalCells) * 100 : 0;
  const effectSize = top && bottom && stats?.stdev ? (top.value - bottom.value) / stats.stdev : null;
  const difference = top && bottom ? top.value - bottom.value : null;
  const unit = measure?.unit ? ` ${measure.unit}` : "";
  const measureLabel = measure?.label || "nilai";
  const dimLabel = dim?.label || "kategori";

  const findings = [];
  if (stats) {
    findings.push(
      `Rata-rata ${measureLabel} ${fmtNum(stats.mean)}${unit} dengan median ${fmtNum(stats.median)}${unit} dan simpangan baku ${fmtNum(stats.stdev)}${unit}.`
    );
  }
  if (top) {
    findings.push(`Kategori ${top.name} mencatat rata-rata tertinggi (${fmtNum(top.value)}${unit}).`);
  }
  if (bottom && top && bottom.name !== top.name) {
    findings.push(
      `Kategori ${bottom.name} terendah (${fmtNum(bottom.value)}${unit}); selisih ${fmtNum(difference)}${unit} terhadap kategori teratas.`
    );
  }
  if (correlation !== null) {
    findings.push(
      `Hubungan ${measureLabel} dengan ${secondary.label} tergolong ${strengthOf(correlation)} (r = ${fmtNum(correlation)}).`
    );
  }
  findings.push(`Kelengkapan data ${fmtNum(completeness, 1)}% dari ${totalRows} baris dan ${profiles.length} kolom.`);

  const limitations = [
    `Ukuran sampel ${totalRows} baris membatasi generalisasi temuan di luar dataset ini.`,
    "Analisis bersifat deskriptif, belum melalui uji signifikansi inferensial.",
  ];
  if (missing > 0) {
    limitations.push(`${missing} sel kosong dapat menurunkan ketepatan ringkasan statistik.`);
  }
  limitations.push(`Perbedaan antar kategori ${dimLabel} belum diuji secara statistik.`);

  const recommendations = [
    `Tambahkan replikasi pengukuran agar estimasi ${measureLabel} lebih stabil.`,
    "Lengkapi sel kosong dan lakukan verifikasi ulang pada baris dengan nilai ekstrem.",
    correlation !== null
      ? `Uji lanjutan dapat memodelkan pengaruh ${secondary.label} terhadap ${measureLabel}.`
      : "Tambahkan kolom numerik kedua untuk analisis hubungan antar variabel.",
    "Gunakan temuan ini sebagai dasar interpretasi laporan, bukan sebagai klaim kausalitas.",
  ];

  const summaryRows = [];
  if (stats) {
    summaryRows.push({ measure: `Rata-rata ${measureLabel}`, result: `${fmtNum(stats.mean)}${unit}`, note: "Ukuran pemusatan utama" });
    summaryRows.push({ measure: "Median", result: `${fmtNum(stats.median)}${unit}`, note: "Nilai tengah sebaran" });
    summaryRows.push({ measure: "Simpangan baku", result: `${fmtNum(stats.stdev)}${unit}`, note: "Sebaran antar pengamatan" });
    summaryRows.push({
      measure: "Rentang",
      result: `${fmtNum(stats.min)} – ${fmtNum(stats.max)}${unit}`,
      note: "Nilai minimum hingga maksimum",
    });
  }
  if (difference !== null) {
    summaryRows.push({ measure: "Selisih kategori", result: `${fmtNum(difference)}${unit}`, note: `${top.name} vs ${bottom.name}` });
  }
  if (correlation !== null) {
    summaryRows.push({ measure: "Korelasi (r)", result: fmtNum(correlation), note: `Hubungan ${strengthOf(correlation)}` });
    summaryRows.push({ measure: "R²", result: fmtNum(correlation ** 2), note: "Proporsi variasi terjelaskan" });
  }
  if (effectSize !== null) {
    summaryRows.push({ measure: "Ukuran efek (d)", result: fmtNum(effectSize), note: `Efek ${effectLabel(effectSize)}` });
  }

  const topRecords = measure
    ? dataset.rows
        .map((row) => ({
          label: row[dim.key] === undefined || row[dim.key] === null ? "–" : String(row[dim.key]),
          value: toNumber(row[measure.key]),
          secondary: secondary ? toNumber(row[secondary.key]) : null,
        }))
        .filter((r) => r.value !== null)
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
    : [];

  const previewRows = dataset.rows.slice(0, 5).map((row, i) => ({
    id: `R-${String(i + 1).padStart(4, "0")}`,
    label: row[dim.key] === undefined || row[dim.key] === null ? "–" : String(row[dim.key]),
    value: toNumber(row[measure.key]),
    secondary: secondary ? toNumber(row[secondary.key]) : null,
  }));

  return {
    dataset,
    report: buildReport({
      dataset,
      stats,
      findings,
      hist,
      correlation,
      measureLabel,
      dimLabel,
      unit,
      top,
      bottom,
      difference,
      effectSize,
      secondary,
      totalRows,
      profiles,
    }),
    profiles,
    numeric,
    dim,
    measure,
    secondary,
    stats,
    groups,
    comparison,
    distribution,
    otherCount,
    top,
    bottom,
    difference,
    correlation,
    fit,
    points,
    hist,
    completeness,
    effectSize,
    missing,
    totalRows,
    unit,
    measureLabel,
    dimLabel,
    findings,
    limitations,
    recommendations,
    summaryRows,
    topRecords,
    previewRows,
  };
}

export function buildReport({
  dataset,
  stats,
  findings,
  hist,
  correlation,
  measureLabel,
  dimLabel,
  unit,
  top,
  bottom,
  difference,
  effectSize,
  secondary,
  totalRows,
  profiles,
}) {
  const peak = hist.length ? hist.reduce((a, b) => (b.count > a.count ? b : a)) : null;
  const symmetric = stats ? Math.abs(stats.mean - stats.median) <= stats.stdev * 0.15 : true;
  const spread = stats ? `${fmtNum(stats.mean - stats.stdev)} – ${fmtNum(stats.mean + stats.stdev)}${unit}` : "–";

  const executive = {
    text: `Dataset ${dataset.name} memuat ${totalRows} pengamatan dengan ${measureLabel} sebagai ukuran utama dan ${dimLabel} sebagai dimensi pembanding. Rata-rata ${measureLabel} tercatat ${fmtNum(
      stats?.mean
    )}${unit} (median ${fmtNum(stats?.median)}${unit}) dengan simpangan baku ${fmtNum(stats?.stdev)}${unit}.`,
    quote: top
      ? `Perbedaan antar kategori ${dimLabel} mencapai ${fmtNum(difference)}${unit} antara ${top.name} dan ${
          bottom?.name || "kategori terendah"
        }, sehingga pola ini layak menjadi temuan utama laporan.`
      : "Data belum memiliki kategori pembanding yang cukup untuk menyimpulkan perbedaan antar kelompok.",
  };

  const descriptive = {
    text: `${symmetric ? "Nilai rata-rata dan median berdekatan" : "Nilai rata-rata dan median berjarak"} pada ${
      stats ? fmtNum(stats.mean) : "–"
    }${unit} dan ${stats ? fmtNum(stats.median) : "–"}${unit}, menandakan sebaran yang ${
      symmetric ? "relatif simetris" : "cenderung tidak simetris"
    }. Simpangan baku ${fmtNum(stats?.stdev)}${unit} menunjukkan sebagian besar pengamatan berada pada rentang ${spread}.`,
    metrics: [
      { label: "Rata-rata", value: `${fmtNum(stats?.mean)}${unit}` },
      { label: "Median", value: `${fmtNum(stats?.median)}${unit}` },
      { label: "SD", value: `${fmtNum(stats?.stdev)}${unit}` },
      { label: "Rentang", value: `${fmtNum(stats?.min)} – ${fmtNum(stats?.max)}` },
    ],
  };

  const distribution = {
    text: peak
      ? `Frekuensi pengamatan tertinggi berada pada rentang ${peak.name} sebanyak ${peak.count} baris, diikuti rentang lain secara bertahap. Sebaran ${measureLabel} bergerak dari ${fmtNum(
          stats?.min
        )}${unit} hingga ${fmtNum(stats?.max)}${unit}, dengan garis rata-rata pada ${fmtNum(stats?.mean)}${unit}.`
      : "Belum ada data numerik yang cukup untuk menggambarkan sebaran.",
  };

  const comparison = {
    text: top
      ? `Kategori ${top.name} mencatat rata-rata tertinggi (${fmtNum(top.value)}${unit}), sedangkan ${
          bottom?.name || "kategori terendah"
        } mencatat ${fmtNum(bottom?.value)}${unit}. Selisih ${fmtNum(difference)}${unit} setara ukuran efek ${
          effectSize === null ? "yang belum dapat dihitung" : `${fmtNum(effectSize)} (${effectLabel(effectSize)})`
        }.`
      : "Belum ada kategori dengan nilai rata-rata yang dapat dibandingkan.",
    metrics: [
      { label: "Rata-rata tertinggi", value: top ? `${fmtNum(top.value)}${unit}` : "–" },
      { label: "Rata-rata terendah", value: bottom ? `${fmtNum(bottom.value)}${unit}` : "–" },
      { label: "Selisih", value: `${fmtNum(difference)}${unit}` },
      { label: "Ukuran efek", value: effectSize === null ? "–" : fmtNum(effectSize) },
    ],
  };

  const relationship = {
    text:
      correlation === null
        ? `Dataset hanya memiliki ${profiles.filter((p) => p.numeric).length} kolom numerik, sehingga hubungan antar variabel belum dapat dihitung. Tambahkan satu variabel numerik lain untuk analisis korelasi.`
        : `Koefisien korelasi antara ${measureLabel} dan ${secondary?.label} sebesar ${fmtNum(correlation)}, tergolong ${strengthOf(
            correlation
          )} dan ${correlation >= 0 ? "searah" : "berlawanan arah"}. Nilai R² ${fmtNum(
            correlation ** 2
          )} berarti sekitar ${fmtNum(correlation ** 2 * 100, 1)}% variasi ${measureLabel} dapat dijelaskan oleh ${secondary?.label}.`,
  };

  const implications = {
    text: "Temuan ini dapat dipakai untuk menentukan prioritas pengukuran lanjutan dan menyusun rekomendasi praktis pada bagian pembahasan laporan.",
    pills: [
      top ? `Kategori ${top.name} unggul` : "Kategori belum tersedia",
      effectSize !== null && Math.abs(effectSize) >= 0.5 ? "Perbedaan bermakna praktis" : "Perbedaan masih kecil",
      correlation !== null ? `Hubungan ${strengthOf(correlation)}` : "Butuh satu variabel lagi",
    ],
  };

  const conclusion = {
    text: `Secara keseluruhan, ${measureLabel} menunjukkan pola yang dapat dijelaskan dari ${totalRows} pengamatan dan ${dimLabel} sebagai pembanding. Interpretasi ini bersifat deskriptif dan siap digunakan sebagai dasar narasi laporan.`,
    quote: "Bukti pada data konsisten, terukur, dan cukup kuat untuk mendukung interpretasi pada laporan penelitian.",
  };

  return { executive, descriptive, distribution, comparison, relationship, implications, conclusion, findings };
}