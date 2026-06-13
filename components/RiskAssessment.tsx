"use client";

import { useEffect, useState } from "react";
import Questionnaire, {
  type QuestionnaireInputs,
} from "@/components/Questionnaire";
import ProcessOverlay from "@/components/ProcessOverlay";
import ResultDisplay from "@/components/ResultDisplay";
import type { MamdaniResult } from "@/lib/fuzzy/mamdani";

/** Durasi animasi proses sebelum hasil tampil (PRD: <1 detik). */
const PROCESS_MS = 900;

/**
 * Orkestrator alur Kuisioner → Proses → Hasil (PRD System Overview 3.2–3.4).
 * Memegang state hasil & input, menjalankan overlay proses, lalu menampilkan hasil.
 */
export default function RiskAssessment() {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<MamdaniResult | null>(null);
  const [inputs, setInputs] = useState<QuestionnaireInputs | null>(null);
  // Mengubah key → remount Questionnaire dengan state bersih saat "Isi Ulang".
  const [formKey, setFormKey] = useState(0);

  function handleResult(r: MamdaniResult, i: QuestionnaireInputs) {
    setProcessing(true);
    setResult(null);
    window.setTimeout(() => {
      setResult(r);
      setInputs(i);
      setProcessing(false);
    }, PROCESS_MS);
  }

  function handleReset() {
    setResult(null);
    setInputs(null);
    setFormKey((k) => k + 1);
    document
      .getElementById("kuisioner")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  // Scroll otomatis ke hasil setelah perhitungan selesai (PRD 3.3).
  useEffect(() => {
    if (result) {
      document.getElementById("hasil")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [result]);

  return (
    <>
      <Questionnaire key={formKey} onResult={handleResult} />
      {processing && <ProcessOverlay />}
      {result && inputs && (
        <ResultDisplay result={result} inputs={inputs} onReset={handleReset} />
      )}
    </>
  );
}
