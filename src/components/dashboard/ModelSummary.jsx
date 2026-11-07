import React from "react";
import Panel from "./Panel";
import { MODELS, f4 } from "@/lib/modeling";

export default function ModelSummary({ modelId, mode, params, ctx, onParamChange }) {
  const model = MODELS[modelId];

  return (
    <Panel
      title="Ringkasan Model"
      sub={mode === "best" ? "Best fit" : "Manual"}
    >
      <div
        className="rounded-xl border border-[#F5E2B5] bg-[#FFF8E9] px-4 py-4 text-center font-serif text-[17px] leading-relaxed text-[#17254B]"
        dangerouslySetInnerHTML={{ __html: model.eq(params) }}
      />
      <div className="mt-5 grid gap-4">
        {model.params.map((pr, i) => {
          const lo = pr.lo(ctx);
          const hi = pr.hi(ctx);
          const step = pr.step(ctx);
          const value = Number.isFinite(params[i]) ? params[i] : pr.init(ctx);
          return (
            <div key={pr.sym}>
              <div className="mb-1 flex items-baseline justify-between gap-2 text-xs text-[#7B8794]">
                <span>{pr.label}</span>
                <b className="text-sm text-[#17254B] tabular-nums">{f4(value)}</b>
              </div>
              <input
                type="range"
                min={lo}
                max={hi}
                step={step > 0 ? step : (hi - lo) / 100}
                value={value}
                onChange={(e) => onParamChange(i, Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer accent-[var(--accent)]"
              />
            </div>
          );
        })}
      </div>
    </Panel>
  );
}