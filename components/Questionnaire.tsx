"use client";

import { useMemo, useState } from "react";
import {
  CHOICE_MAX,
  CHOICE_MIN,
  SLEEP_MAX,
  SLEEP_MIN,
  choiceToScore,
  stressQuestions,
} from "@/lib/questions";
import { runMamdani, type MamdaniResult } from "@/lib/fuzzy/mamdani";

export interface QuestionnaireInputs {
  stressScore: number; // 0–100 (jumlah 10 nilai terkonversi)
  sleepHours: number; // 0–12
}

interface QuestionnaireProps {
  onResult?: (result: MamdaniResult, inputs: QuestionnaireInputs) => void;
}

const QUESTION_COUNT = stressQuestions.length;
const CHOICES = Array.from(
  { length: CHOICE_MAX - CHOICE_MIN + 1 },
  (_, i) => CHOICE_MIN + i,
);
// Ukuran lingkaran membesar ke kanan (aksen visual: pilihan makin "kuat").
const CIRCLE_SIZES = [22, 27, 32, 37, 42];

export default function Questionnaire({ onResult }: QuestionnaireProps) {
  const [choices, setChoices] = useState<(number | null)[]>(
    Array(QUESTION_COUNT).fill(null),
  );
  const [sleep, setSleep] = useState<number | null>(null);

  const stressScore = useMemo(
    () => choices.reduce<number>((sum, c) => sum + (c ? choiceToScore(c) : 0), 0),
    [choices],
  );

  const answeredCount = choices.filter((c) => c !== null).length;
  const allStressAnswered = answeredCount === QUESTION_COUNT;
  const canSubmit = allStressAnswered && sleep !== null;

  function setChoice(index: number, value: number) {
    setChoices((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleSubmit() {
    if (!allStressAnswered || sleep === null) return;
    const inputs: QuestionnaireInputs = { stressScore, sleepHours: sleep };
    const result = runMamdani(inputs.stressScore, inputs.sleepHours);
    if (onResult) onResult(result, inputs);
    // eslint-disable-next-line no-console
    else console.log("[FuzzyMind] hasil:", result, "input:", inputs);
  }

  return (
    <section
      id="kuisioner"
      aria-labelledby="kuisioner-heading"
      className="mx-auto max-w-content scroll-mt-16 border-x border-b border-border-default"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border-default bg-surface px-5 py-3">
        <h2
          id="kuisioner-heading"
          className="eyebrow flex items-center gap-2 text-text-secondary"
        >
          <span className="text-accent">▣</span> Kuisioner Tingkat Stres
        </h2>
        <span className="font-mono text-xs text-text-muted">
          <span className={allStressAnswered ? "text-accent" : "text-text-primary"}>
            {answeredCount}
          </span>
          /{QUESTION_COUNT} soal
        </span>
      </div>

      {/* Skala panduan */}
      <div className="hidden items-center justify-end gap-6 border-b border-border-default px-5 py-2 sm:flex">
        <span className="font-mono text-[11px] text-text-muted">
          1 = rendah · 5 = tinggi
        </span>
      </div>

      {/* Daftar soal */}
      <ol>
        {stressQuestions.map((q, i) => {
          const answered = choices[i] !== null;
          return (
            <li
              key={q.id}
              className="border-b border-border-default px-5 py-4 transition-colors hover:bg-surface/40"
            >
              <fieldset className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-6">
                <legend className="flex flex-1 items-start gap-3">
                  <span
                    className={`stat-num mt-0.5 w-6 shrink-0 text-sm ${
                      answered ? "text-accent" : "text-text-muted"
                    }`}
                  >
                    {String(q.id).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-text-primary sm:text-base">
                    {q.text}
                  </span>
                </legend>

                <div className="flex items-center gap-2 pl-9 lg:gap-3 lg:pl-0">
                  <span className="hidden w-20 text-right text-[11px] leading-tight text-text-muted sm:block">
                    {q.leftLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    {CHOICES.map((choice, ci) => {
                      const size = CIRCLE_SIZES[ci];
                      const selected = choices[i] === choice;
                      return (
                        <label
                          key={choice}
                          className="group flex cursor-pointer items-center"
                        >
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={choice}
                            checked={selected}
                            onChange={() => setChoice(i, choice)}
                            aria-label={`${choice} — ${
                              choice === CHOICE_MIN
                                ? q.leftLabel
                                : choice === CHOICE_MAX
                                  ? q.rightLabel
                                  : `tingkat ${choice}`
                            }`}
                            className="peer sr-only"
                          />
                          <span
                            style={{ width: size, height: size }}
                            className="flex items-center justify-center rounded-full border border-accent-3 font-mono text-[11px] font-bold text-text-muted transition-colors group-hover:border-accent peer-checked:border-accent peer-checked:bg-accent peer-checked:text-[var(--bg-base)] peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink"
                          >
                            {choice}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  <span className="hidden w-20 text-left text-[11px] leading-tight text-text-muted sm:block">
                    {q.rightLabel}
                  </span>
                </div>
              </fieldset>
            </li>
          );
        })}
      </ol>

      {/* Baris jam tidur */}
      <div className="flex flex-col gap-3 border-b border-border-default bg-surface/40 px-5 py-4 sm:flex-row sm:items-center sm:gap-6">
        <label htmlFor="sleep" className="flex flex-1 items-center gap-3">
          <span className="stat-num w-6 text-sm text-accent-3" aria-hidden>
            🌙
          </span>
          <span className="text-sm text-text-primary sm:text-base">
            Rata-rata jam tidur per malam
          </span>
        </label>
        <div className="flex items-center gap-3 pl-9 sm:w-72 sm:pl-0">
          <span className="font-mono text-[11px] text-text-muted">{SLEEP_MIN}</span>
          <input
            id="sleep"
            type="range"
            min={SLEEP_MIN}
            max={SLEEP_MAX}
            step={1}
            value={sleep ?? 0}
            onChange={(e) => setSleep(Number(e.target.value))}
            aria-valuetext={sleep === null ? "belum diisi" : `${sleep} jam`}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-border-default accent-accent"
          />
          <span className="font-mono text-[11px] text-text-muted">{SLEEP_MAX}</span>
          <span
            className={`stat-num w-10 text-right text-sm ${
              sleep === null ? "text-text-muted" : "text-accent"
            }`}
          >
            {sleep === null ? "—" : `${sleep}j`}
          </span>
        </div>
      </div>

      {/* Footer: status kelengkapan + tombol */}
      <div className="flex flex-col gap-4 bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-text-muted">
          {canSubmit
            ? "Semua input terisi — siap dihitung."
            : "Lengkapi semua soal & jam tidur untuk menghitung risiko."}
        </p>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          aria-disabled={!canSubmit}
          className="font-display text-sm font-semibold transition-colors enabled:bg-accent enabled:px-7 enabled:py-3 enabled:text-[var(--bg-base)] enabled:hover:bg-accent-2 disabled:cursor-not-allowed disabled:border disabled:border-border-default disabled:bg-transparent disabled:px-7 disabled:py-3 disabled:text-text-muted"
        >
          Hitung Risiko →
        </button>
      </div>
    </section>
  );
}
