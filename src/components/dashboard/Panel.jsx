import React from "react";

export default function Panel({ title, sub, right, tone = "light", children, className = "", bodyClassName = "" }) {
  const accent = tone === "accent";
  return (
    <section className={`overflow-hidden rounded-2xl border border-[#DFE4F7] bg-white shadow-[0_1px_0_rgba(23,37,75,0.03)] ${className}`}>
      <div
        className={`flex flex-wrap items-center gap-2.5 border-b px-5 py-3.5 ${
          accent
            ? "border-transparent bg-[var(--accent)] text-white"
            : "border-transparent bg-[var(--accent-ink)] text-[var(--accent-soft)]"
        }`}
      >
        {!accent && <span className="h-3.5 w-1.5 shrink-0 rounded-full bg-[var(--accent-soft)]" />}
        <h2
          className={`text-[15px] font-extrabold leading-tight ${
            accent ? "text-white" : "text-[var(--accent-soft)]"
          }`}
        >
          {title}
        </h2>
        {sub ? (
          <span
            className="text-xs font-medium"
            style={accent ? undefined : { color: "var(--accent-soft)", opacity: 0.72 }}
          >
            {sub}
          </span>
        ) : null}
        {right ? <div className="ml-auto">{right}</div> : null}
      </div>
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </section>
  );
}