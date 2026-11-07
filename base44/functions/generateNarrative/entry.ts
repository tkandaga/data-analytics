import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const SECTION_KEYS = ['executive', 'descriptive', 'comparison', 'relationship', 'conclusion'];

function str(value, max = 200) {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function round(value, digits = 3) {
  return value === null ? null : Number(value.toFixed(digits));
}

function shape(record) {
  if (!record || typeof record !== 'object') return null;
  return { name: str(record.name, 80), value: num(record.value) };
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth
      .me()
      .catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const summary = body?.summary;
    if (!summary || typeof summary !== 'object' || Array.isArray(summary)) {
      return Response.json({ error: 'summary is required' }, { status: 400 });
    }

    const stats = summary.stats && typeof summary.stats === 'object' ? summary.stats : {};
    const context = {
      dataset: str(summary.datasetName, 120) || 'dataset penelitian',
      totalRows: num(summary.totalRows),
      measure: str(summary.measureLabel, 80) || 'variabel utama',
      dimension: str(summary.dimLabel, 80) || 'kategori',
      secondary: str(summary.secondaryLabel, 80) || null,
      stats: {
        mean: round(num(stats.mean)),
        median: round(num(stats.median)),
        stdev: round(num(stats.stdev)),
        min: round(num(stats.min)),
        max: round(num(stats.max)),
      },
      top: shape(summary.top),
      bottom: shape(summary.bottom),
      difference: round(num(summary.difference)),
      correlation: round(num(summary.correlation)),
      effectSize: round(num(summary.effectSize)),
      completeness: round(num(summary.completeness), 2),
      findings: Array.isArray(summary.findings)
        ? summary.findings.slice(0, 8).map((f) => str(f, 240)).filter(Boolean)
        : [],
    };

    const prompt = `Anda adalah analis data kimia yang menulis narasi interpretasi untuk laporan penelitian.

Ringkasan hasil analisis (JSON):
${JSON.stringify(context, null, 2)}

Tulis narasi interpretasi dalam bahasa Indonesia akademik dengan lima bagian:
1. executive: ringkasan temuan utama dalam 3-5 kalimat.
2. descriptive: gambaran sebaran variabel ${context.measure} berdasarkan rata-rata, median, simpangan baku, dan rentang.
3. comparison: perbandingan antar kategori ${context.dimension}, sebutkan kategori tertinggi dan terendah jika tersedia.
4. relationship: hubungan antar variabel numerik (korelasi) bila tersedia, jika tidak jelaskan bahwa analisis hubungan belum dapat dilakukan.
5. conclusion: kesimpulan deskriptif dan arahan analisis lanjutan dalam 3-4 kalimat.

Aturan: gunakan angka yang ada pada ringkasan, jangan mengarang nilai baru. Setiap bagian berupa paragraf mengalir tanpa poin-poin, tanpa emoji, tanpa judul bagian, dan tanpa tanda hubung panjang. Jangan menyatakan klaim kausalitas.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: SECTION_KEYS.reduce((acc, key) => ({ ...acc, [key]: { type: 'string' } }), {}),
        required: SECTION_KEYS,
      },
    });

    const narrative = {};
    SECTION_KEYS.forEach((key) => {
      narrative[key] = str(result?.[key], 2000);
    });

    if (!SECTION_KEYS.some((key) => narrative[key])) {
      return Response.json({ error: 'Narasi tidak dapat dibuat, coba lagi.' }, { status: 502 });
    }

    return Response.json({ narrative });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}