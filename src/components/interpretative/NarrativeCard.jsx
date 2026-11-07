import React from "react";

export default function NarrativeCard({ title, icon: Icon, text, quote, metrics, footer }) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-[#E6E4F5] bg-white/90 p-5 shadow-[0_14px_36px_-30px_rgba(30,27,75,0.6)]">
      <div className="flex items-start gap-2.5">
        {Icon ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#EDE9FE] text-[#6D28D9]">
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <h2 className="pt-1 text-[14px] font-extrabold leading-tight text-[#1E1B4B]">{title}</h2>
      </div>

      <p className="mt-3 text-[12px] leading-relaxed text-[#3F3D56]">{text}</p>

      {quote ? (
        <blockquote className="mt-3 rounded-xl border-l-[3px] border-[#8B5CF6] bg-[#F7F5FF] px-3 py-2.5 text-[11.5px] font-medium italic leading-relaxed text-[#4C1D95]">
          {quote}
        </blockquote>
      ) : null}

      {metrics?.length ? (
        <dl className="mt-3 grid grid-cols-2 gap-2">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl bg-[#F7F7FC] px-3 py-2">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#8A88A8]">{m.label}</dt>
              <dd className="mt-0.5 text-[13px] font-extrabold text-[#1E1B4B]">{m.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {footer ? <div className="mt-3">{footer}</div> : null}
    </section>
  );
}