import React, { useState } from "react";
import Panel from "@/components/dashboard/Panel";
import { fmtNum } from "@/lib/general";
import {
  discriminationLabel,
  difficultyLabel,
  fmtP,
  itemAnalysis,
  reliabilityLabel,
} from "@/lib/statistics";
import TestSelect from "./TestSelect";
import SigBadge from "./SigBadge";
import MiniStat from "./MiniStat";
import InterpretationBox from "./InterpretationBox";

const MAX_OPTIONS = [
  { value: "auto", label: "Otomatis (nilai tertinggi butir)" },
  { value: "1", label: "1 (skor benar/salah)" },
  { value: "4", label: "4 (skala 1–4)" },
  { value: "5", label: "5 (skala 1–5)" },
];

function diffTone(p) {
  if (p > 0.7) return "text-[#1D4ED8]";
  if (p >= 0.3) return "text-[#15803D]";
  return "text-[#B45309]";
}

function discTone(d) {
  if (d >= 0.3) return "text-[#15803D]";
  if (d >= 0.2) return "text-[#B45309]";
  return "text-[#B91C1C]";
}

export default function InstrumentPanel({ analysis }) {
  const [maxMode, setMaxMode] = useState("auto");
  const numeric = analysis.numeric;
  const columns = numeric.slice(0, 10);
  const labels = new Map(columns.map((c) => [c.key, c.label]));

  if (!columns.length) {
    return (
      <Panel title="Kualitas Instrumen" sub="validitas, reliabilitas, kesukaran, daya pembeda">
        <p className="py-12 text-center text-sm text-[#7B8794]">
          Dataset belum memiliki kolom numerik yang dapat diperlakukan sebagai butir soal.
        </p>
      </Panel>
    );
  }

  const result = itemAnalysis(analysis.dataset, columns.map((c) => c.key), maxMode);

  if (!result) {
    return (
      <Panel title="Kualitas Instrumen" sub="validitas, reliabilitas, kesukaran, daya pembeda">
        <p className="py-12 text-center text-sm text-[#7B8794]">
          Data belum cukup: dibutuhkan minimal empat baris yang terisi lengkap pada seluruh butir.
        </p>
      </Panel>
    );
  }

  const { items, alpha, n, k } = result;
  const validCount = items.filter((it) => it.rit >= 0.3).length;
  const goodDisc = items.filter((it) => it.d >= 0.3).length;
  const easyCount = items.filter((it) => it.p > 0.7).length;
  const hardCount = items.filter((it) => it.p < 0.3).length;
  const weakest = [...items].sort((a, b) => a.rit - b.rit)[0];
  const alphaOk = Number.isFinite(alpha) && alpha >= 0.7;

  return (
    <Panel
      title="Kualitas Instrumen"
      sub="validitas, reliabilitas, tingkat kesukaran, daya pembeda"
      bodyClassName="pt-4"
      right={
        <SigBadge tone={alphaOk ? "ok" : "warn"}>
          α = {fmtNum(alpha, 3)} · {reliabilityLabel(alpha)}
        </SigBadge>
      }
    >
      <div className="grid items-start gap-3 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <div className="rounded-xl border border-[#E9E6FB] bg-gradient-to-br from-[#F7F5FF] to-white px-4 py-3">
            <div className="text-[9.5px] font-bold uppercase tracking-[0.08em] text-[#8B87A8]">
              Cronbach&apos;s Alpha
            </div>
            <div className="mt-0.5 text-2xl font-extrabold leading-none text-[#4C1D95]">{fmtNum(alpha, 3)}</div>
            <div className="mt-1 text-[10.5px] text-[#6B7280]">
              {k} butir · {n} responden lengkap
            </div>
          </div>
          <div className="mt-2">
            <TestSelect label="Skor maksimum butir" value={maxMode} onChange={setMaxMode} options={MAX_OPTIONS} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:col-span-8">
          <MiniStat label="Butir valid" value={`${validCount}/${k}`} hint="r butir–total ≥ 0,30" />
          <MiniStat label="Daya pembeda baik" value={`${goodDisc}/${k}`} hint="D ≥ 0,30" />
          <MiniStat label="Butir mudah" value={easyCount} hint="p > 0,70" />
          <MiniStat label="Butir sukar" value={hardCount} hint="p < 0,30" />
        </div>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[620px] text-[11px]">
          <thead>
            <tr className="border-b border-[#E9E6FB] text-left text-[9px] uppercase tracking-[0.05em] text-[#8B87A8]">
              <th className="py-1.5 pr-2 font-bold">Butir</th>
              <th className="py-1.5 pr-2 text-right font-bold">Rata-rata</th>
              <th className="py-1.5 pr-2 text-right font-bold">p</th>
              <th className="py-1.5 pr-2 font-bold">Kesukaran</th>
              <th className="py-1.5 pr-2 text-right font-bold">D</th>
              <th className="py-1.5 pr-2 font-bold">Daya pembeda</th>
              <th className="py-1.5 pr-2 text-right font-bold">r it</th>
              <th className="py-1.5 font-bold">Validitas</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={it.key} className="border-b border-[#F2F0FC] text-[#3F3D56]">
                <td className="py-1.5 pr-2 font-semibold text-[#1E1B4B]">
                  {i + 1}. {labels.get(it.key)}
                </td>
                <td className="py-1.5 pr-2 text-right">{fmtNum(it.mean)}</td>
                <td className="py-1.5 pr-2 text-right">{fmtNum(it.p, 2)}</td>
                <td className={`py-1.5 pr-2 font-semibold ${diffTone(it.p)}`}>{difficultyLabel(it.p)}</td>
                <td className="py-1.5 pr-2 text-right">{fmtNum(it.d, 2)}</td>
                <td className={`py-1.5 pr-2 font-semibold ${discTone(it.d)}`}>{discriminationLabel(it.d)}</td>
                <td className="py-1.5 pr-2 text-right">{fmtNum(it.rit, 2)}</td>
                <td className={`py-1.5 font-semibold ${it.rit >= 0.3 ? "text-[#15803D]" : "text-[#B91C1C]"}`}>
                  {it.rit >= 0.3 ? "valid" : "tidak valid"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-1.5 text-[10px] leading-relaxed text-[#8B87A8]">
        p = rata-rata skor ÷ skor maksimum; D = proporsi skor kelompok atas (27%) − kelompok bawah (27%); r it = korelasi
        butir dengan total tanpa butir tersebut. Nilai p butir terlemah: {fmtP(weakest.ritP)}.
      </p>

      <InterpretationBox title="Interpretasi kualitas instrumen">
        <p>
          Reliabilitas instrumen {fmtNum(alpha, 3)} tergolong {reliabilityLabel(alpha)}.{" "}
          {alphaOk
            ? "Nilai di atas 0,70 menandakan instrumen cukup konsisten untuk digunakan kembali."
            : "Nilai di bawah 0,70 menandakan butir belum konsisten mengukur konstruk yang sama; butir ber-r rendah perlu direvisi atau dibuang."}
        </p>
        <p>
          {validCount} dari {k} butir memiliki korelasi butir–total ≥ 0,30 sehingga dianggap valid. Butir dengan
          validitas terendah adalah {labels.get(weakest.key)} (r = {fmtNum(weakest.rit, 3)}).
        </p>
        <p>
          {goodDisc} butir memiliki daya pembeda ≥ 0,30 (baik atau baik sekali). {easyCount} butir tergolong mudah (p &gt;
          0,70) dan {hardCount} butir tergolong sukar (p &lt; 0,30); butir dengan p di luar 0,30–0,70 kurang optimal
          membedakan kemampuan peserta.
        </p>
        <p className="font-semibold text-[#4C1D95]">
          Implikasi: pertahankan butir valid dengan daya pembeda baik, revisi butir dengan D &lt; 0,20, dan seimbangkan
          tingkat kesukaran agar instrumen mengukur kemampuan secara menyebar.
        </p>
      </InterpretationBox>
    </Panel>
  );
}