import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import UploadStep from "@/components/studio/UploadStep";
import ThemeStep from "@/components/studio/ThemeStep";
import TypeStep from "@/components/studio/TypeStep";
import { SAMPLE_DATASET, loadStudio, saveStudio } from "@/lib/studio";
import { parseCSV, pickKeys } from "@/lib/modeling";

const STEPS = ["Unggah data", "Warna tema", "Jenis dashboard"];

export default function AnalyticsStudio() {
  const initial = loadStudio();
  const [step, setStep] = useState(0);
  const [dataset, setDataset] = useState(initial.dataset);
  const [themeId, setThemeId] = useState(initial.themeId);
  const [type, setType] = useState(initial.type || "modeling");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleFile = async (file) => {
    try {
      const parsed = parseCSV(await file.text());
      setDataset({ name: file.name, ...parsed });
      setError("");
    } catch (err) {
      setError(err.message || "File CSV tidak dapat dibaca.");
    }
  };

  const finish = () => {
    const keys = pickKeys(dataset.columns);
    saveStudio({ dataset, themeId, type, xKey: keys.xKey, yKey: keys.yKey });
    navigate(type === "general" ? "/general" : type === "interpretative" ? "/interpretative" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F4F6FC]">
      <header className="border-b border-[#E4E8F6] bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <img
              src="https://media.base44.com/images/public/6ab290c11265ad626905aac0/b38dd8bff_Logo_UT-transparan.png"
              alt="Universitas Terbuka"
              className="h-8 w-auto"
            />
            <div>
              <div className="text-sm font-extrabold text-[#17254B]">Chemistry Data Analytics</div>
              <div className="text-[11px] text-[#7B8794]">AI Data Studio</div>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="rounded-lg border border-[#E4E8F6] bg-white px-3.5 py-2 text-xs font-bold text-[#17254B] transition hover:border-[#6430DA] hover:text-[#6430DA]"
          >
            Buka dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E9E2FD] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#4A22B8]">
            <Sparkles className="h-3.5 w-3.5" /> AI Data Studio
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-[#17254B] sm:text-4xl">
            Buat dashboard analitik dari data Anda
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#697695] sm:text-base">
            Unggah data, pilih tema dan jenis dashboard, lalu atur sendiri bagian mana yang ditampilkan beserta
            urutannya.
          </p>
        </div>

        <ol className="mx-auto mt-8 flex max-w-2xl items-center gap-2">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <li key={label} className="flex flex-1 items-center gap-2">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold ${
                    done
                      ? "bg-[#6430DA] text-white"
                      : active
                      ? "bg-[#6430DA] text-white ring-4 ring-[#EDE6FE]"
                      : "bg-[#E9EDF9] text-[#8B95B5]"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className={`hidden text-xs font-bold sm:block ${active ? "text-[#17254B]" : "text-[#8B95B5]"}`}>
                  {label}
                </span>
                {i < STEPS.length - 1 && <span className="h-px flex-1 bg-[#DDE3F2]" />}
              </li>
            );
          })}
        </ol>

        <section className="mt-6 rounded-2xl border border-[#E4E8F6] bg-white p-5 shadow-[0_18px_40px_-32px_rgba(23,37,75,0.6)] sm:p-7">
          {step === 0 && (
            <UploadStep
              dataset={dataset}
              error={error}
              onFile={handleFile}
              onSample={() => {
                setDataset(SAMPLE_DATASET);
                setError("");
              }}
            />
          )}
          {step === 1 && <ThemeStep themeId={themeId} onSelect={setThemeId} />}
          {step === 2 && <TypeStep type={type} onSelect={setType} />}

          <div className="mt-7 flex items-center justify-between gap-3 border-t border-[#EEF1F9] pt-5">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-[#7B8794] transition hover:text-[#17254B] disabled:opacity-40"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali
            </button>

            {step < 2 ? (
              <button
                onClick={() => setStep((s) => Math.min(2, s + 1))}
                disabled={!dataset.rows.length}
                className="flex items-center gap-1.5 rounded-lg bg-[#6430DA] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#4A22B8] disabled:opacity-50"
              >
                Lanjut <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={finish}
                disabled={!dataset.rows.length}
                className="flex items-center gap-1.5 rounded-lg bg-[#6430DA] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#4A22B8] disabled:opacity-50"
              >
                Buat Dashboard <Sparkles className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}