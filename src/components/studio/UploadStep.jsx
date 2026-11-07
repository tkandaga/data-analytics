import React, { useState } from "react";
import { FileSpreadsheet, Upload } from "lucide-react";

export default function UploadStep({ dataset, error, onFile, onSample }) {
  const [drag, setDrag] = useState(false);
  const cols = dataset.columns.slice(0, 5);

  return (
    <div>
      <h2 className="text-lg font-bold text-[#17254B]">Unggah data eksperimen</h2>
      <p className="mt-1 text-sm text-[#697695]">
        Format CSV dengan baris judul kolom. Kolom numerik dideteksi otomatis.
      </p>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const file = e.dataTransfer.files?.[0];
          if (file) onFile(file);
        }}
        className={`mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          drag ? "border-[#6430DA] bg-[#F6F2FF]" : "border-[#D7DEF2] bg-[#FAFBFF] hover:border-[#6430DA] hover:bg-[#F6F2FF]"
        }`}
      >
        <input
          type="file"
          accept=".csv,.txt"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
            e.target.value = "";
          }}
        />
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9E2FD] text-[#6430DA]">
          <Upload className="h-5 w-5" />
        </span>
        <span className="text-sm font-bold text-[#17254B]">Tarik file CSV ke sini atau klik untuk memilih</span>
        <span className="text-xs text-[#7B8794]">Maksimal beberapa ribu baris</span>
      </label>

      {error ? <p className="mt-3 text-sm font-semibold text-[#C0392B]">{error}</p> : null}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E4E8F6] bg-white px-4 py-3">
        <div className="flex items-center gap-2.5">
          <FileSpreadsheet className="h-4 w-4 text-[#6430DA]" />
          <div>
            <div className="text-sm font-bold text-[#17254B]">{dataset.name}</div>
            <div className="text-xs text-[#7B8794]">
              {dataset.rows.length} baris · {dataset.columns.length} kolom
            </div>
          </div>
        </div>
        <button onClick={onSample} className="text-xs font-bold text-[#6430DA] hover:underline">
          Pakai data contoh
        </button>
      </div>

      {dataset.rows.length > 0 && (
        <div className="mt-4 overflow-auto rounded-xl border border-[#E4E8F6]">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-[#E9E2FD] text-[10px] font-extrabold uppercase tracking-wider text-[#17254B]">
                {cols.map((c) => (
                  <th key={c.key} className="px-3 py-2 text-left">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataset.rows.slice(0, 6).map((row, i) => (
                <tr key={i} className={i % 2 ? "bg-[#F7F9FF]" : "bg-white"}>
                  {cols.map((c) => (
                    <td key={c.key} className="px-3 py-1.5 tabular-nums text-[#17254B]">
                      {row[c.key] === null || row[c.key] === undefined ? "–" : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}