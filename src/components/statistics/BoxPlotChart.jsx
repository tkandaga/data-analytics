import React from "react";
import { fmtNum } from "@/lib/general";

const W = 760;
const H = 260;
const PAD = { l: 54, r: 14, t: 14, b: 46 };

export default function BoxPlotChart({ items, unit = "" }) {
  const boxes = items.filter((b) => b.stats && Number.isFinite(b.stats.q1));
  if (!boxes.length) return null;

  const all = boxes.flatMap((b) => [b.stats.lowerWhisker, b.stats.upperWhisker, ...b.stats.outliers]);
  let min = Math.min(...all);
  let max = Math.max(...all);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const span = max - min || 1;
  const plotH = H - PAD.t - PAD.b;
  const plotW = W - PAD.l - PAD.r;
  const y = (value) => PAD.t + (1 - (value - min) / span) * plotH;
  const slot = plotW / boxes.length;
  const boxW = Math.min(76, slot * 0.48);
  const ticks = Array.from({ length: 5 }, (_, i) => min + (span * i) / 4);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[260px] w-full" role="img" aria-label="Boxplot distribusi">
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="#EEF0FB" strokeWidth="1" />
            <text x={PAD.l - 8} y={y(t) + 3.5} textAnchor="end" fontSize="10" fill="#7B8794">
              {fmtNum(t, 1)}
            </text>
          </g>
        ))}
        {boxes.map((b, i) => {
          const cx = PAD.l + slot * i + slot / 2;
          const { q1, q3, median, lowerWhisker, upperWhisker, outliers } = b.stats;
          return (
            <g key={`${b.name}-${i}`}>
              <line x1={cx} x2={cx} y1={y(upperWhisker)} y2={y(q3)} stroke="#6D28D9" strokeWidth="1.5" />
              <line x1={cx} x2={cx} y1={y(q1)} y2={y(lowerWhisker)} stroke="#6D28D9" strokeWidth="1.5" />
              <line
                x1={cx - boxW / 3}
                x2={cx + boxW / 3}
                y1={y(upperWhisker)}
                y2={y(upperWhisker)}
                stroke="#6D28D9"
                strokeWidth="1.5"
              />
              <line
                x1={cx - boxW / 3}
                x2={cx + boxW / 3}
                y1={y(lowerWhisker)}
                y2={y(lowerWhisker)}
                stroke="#6D28D9"
                strokeWidth="1.5"
              />
              <rect
                x={cx - boxW / 2}
                y={y(q3)}
                width={boxW}
                height={Math.max(1, y(q1) - y(q3))}
                fill="#EDE9FE"
                stroke="#8B5CF6"
                strokeWidth="1.5"
                rx="3"
              />
              <line
                x1={cx - boxW / 2}
                x2={cx + boxW / 2}
                y1={y(median)}
                y2={y(median)}
                stroke="#1E1B4B"
                strokeWidth="2.5"
              />
              {outliers.map((o, j) => (
                <circle key={j} cx={cx} cy={y(o)} r="2.6" fill="#F59E0B" />
              ))}
              <text
                x={cx}
                y={H - PAD.b + 17}
                textAnchor="middle"
                fontSize="9.5"
                fill="#4C4585"
                fontWeight="600"
              >
                {b.name.length > 13 ? `${b.name.slice(0, 12)}…` : b.name}
              </text>
              <title>{`${b.name}: median ${fmtNum(median, 1)}${unit}, Q1 ${fmtNum(q1, 1)}, Q3 ${fmtNum(q3, 1)}`}</title>
            </g>
          );
        })}
      </svg>
    </div>
  );
}