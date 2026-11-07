import React from "react";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, CheckCircle2, Info, Sigma } from "lucide-react";
import Panel from "@/components/dashboard/Panel";

const ICONS = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  avg: Sigma,
  alert: AlertTriangle,
  ok: CheckCircle2,
  info: Info,
};

const TONES = {
  up: "bg-[#E7F5EE] text-[#178D65]",
  down: "bg-[#FFF3EB] text-[#A85320]",
  avg: "bg-[#E9F3FF] text-[#1C69C6]",
  alert: "bg-[#FDECF2] text-[#C2255C]",
  ok: "bg-[#E7F5EE] text-[#178D65]",
  info: "bg-[#F1EFFF] text-[#6240C8]",
};

export default function InsightsPanel({ insights }) {
  return (
    <Panel title="Insight Otomatis" sub="temuan utama dari data" bodyClassName="pt-3">
      {insights.length ? (
        <ul className="flex flex-col gap-3">
          {insights.map((item, i) => {
            const Icon = ICONS[item.kind] || Info;
            return (
              <li key={i} className="flex items-start gap-2.5">
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${TONES[item.kind] || TONES.info}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <p className="text-[11.5px] leading-relaxed text-[#495266]">{item.text}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="py-16 text-center text-sm text-[#7B8794]">Belum ada insight yang dapat dihitung.</p>
      )}
    </Panel>
  );
}