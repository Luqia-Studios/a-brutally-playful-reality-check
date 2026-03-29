"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { MeterArc } from "@/components/meter-arc";
import { useViewportMetrics } from "@/lib/use-viewport-metrics";
import {
  MAX_PLAN_LENGTH,
  MIN_PLAN_LENGTH,
  PLAN_SESSION_KEY,
  SAMPLE_INPUTS
} from "@/lib/analyze-plan";

export function InputExperience() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { keyboardOpen } = useViewportMetrics();
  const [draft, setDraft] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (draft.trim().length > 0) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setPlaceholderIndex((current) => (current + 1) % SAMPLE_INPUTS.length);
    }, 2600);

    return () => {
      window.clearInterval(interval);
    };
  }, [draft]);

  const trimmed = draft.trim();
  const isTooShort = trimmed.length > 0 && trimmed.length < MIN_PLAN_LENGTH;
  const isValid = trimmed.length >= MIN_PLAN_LENGTH;

  function handleExample() {
    const nextExample = SAMPLE_INPUTS[exampleIndex % SAMPLE_INPUTS.length];
    setDraft(nextExample);
    setExampleIndex((current) => current + 1);
    textareaRef.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValid) {
      textareaRef.current?.focus();
      return;
    }

    sessionStorage.setItem(PLAN_SESSION_KEY, trimmed);
    setIsSubmitting(true);
    router.push("/risultato");
  }

  return (
    <main className={`viewport-shell overflow-x-hidden ${keyboardOpen ? "overflow-y-auto" : ""}`}>
      <div
        className={`mx-auto flex max-w-6xl flex-col px-4 sm:px-8 lg:px-10 ${
          keyboardOpen ? "min-h-full py-4 sm:py-6 lg:py-8" : "h-full py-4 sm:py-6 lg:py-8"
        }`}
      >
        <header className={`flex items-start justify-between ${keyboardOpen ? "pb-3" : "pb-3 sm:pb-5"}`}>
          <BrandMark />
          <p className="pt-1 text-[12px] uppercase tracking-[0.18em] text-black/34 sm:text-sm sm:normal-case sm:tracking-normal">
            Esperimento 01
          </p>
        </header>

        <section
          className={`grid min-h-0 flex-1 ${
            keyboardOpen
              ? "items-start gap-3 sm:gap-6 lg:items-center lg:gap-14"
              : "items-stretch gap-3 sm:gap-8 lg:items-center lg:gap-14"
          } lg:grid-cols-[0.42fr_0.58fr]`}
        >
          <div
            className={`hidden min-h-0 flex-col lg:flex ${
              keyboardOpen ? "justify-start gap-3" : "justify-start gap-3 sm:gap-5 lg:justify-center lg:gap-6"
            }`}
          >
            <div className="max-w-[18rem] space-y-3">
              <p className="text-[20px] leading-8 text-black/54">Scrivilo. Vediamo.</p>
            </div>

            <div className="hidden lg:block">
              <MeterArc score={64} size="sm" label="Anteprima" showScale={false} />
            </div>
          </div>

          <div className="flex min-h-0 h-full items-stretch lg:items-center lg:justify-end">
            <div className="surface-panel flex h-full min-h-[min(58svh,34rem)] w-full flex-1 flex-col rounded-[30px] p-4 sm:min-h-0 sm:p-5 lg:max-w-[38rem] lg:min-h-[min(74svh,48rem)] lg:flex-none lg:rounded-[34px] lg:p-6">
              <form className="flex h-full flex-1 flex-col" onSubmit={handleSubmit}>
                <div className="flex min-h-0 flex-1 flex-col gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <label htmlFor="plan" className="text-[21px] font-medium text-text sm:text-[19px]">
                      Il tuo piano
                    </label>
                    <span className="text-[14px] uppercase tracking-[0.18em] text-black/30 sm:text-[13px]">
                      {trimmed.length}/{MAX_PLAN_LENGTH}
                    </span>
                  </div>

                  <textarea
                    id="plan"
                    ref={textareaRef}
                    value={draft}
                    maxLength={MAX_PLAN_LENGTH}
                    rows={6}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder={SAMPLE_INPUTS[placeholderIndex]}
                    className={`w-full resize-none rounded-[28px] border hairline bg-[#FBFAF7] px-5 tracking-[-0.015em] text-text outline-none transition placeholder:text-black/28 focus:border-[#D8D1C6] focus:bg-white ${
                      keyboardOpen
                        ? "min-h-[180px] py-5 text-[24px] leading-9"
                        : "min-h-[250px] py-6 text-[26px] leading-10 sm:min-h-[220px] sm:py-5 sm:text-[21px] sm:leading-8"
                    }`}
                  />

                  <div className={`space-y-4 ${keyboardOpen ? "hidden sm:block" : ""}`}>
                    <button
                      type="button"
                      onClick={handleExample}
                      className="w-full rounded-[22px] border hairline bg-[#FBFAF7] px-4 py-4 text-left text-[20px] text-black/58 transition hover:bg-white hover:text-text sm:text-[18px]"
                    >
                      Prova un esempio
                    </button>
                  </div>
                </div>

                <div
                  className={`space-y-3 ${
                    keyboardOpen
                      ? "sticky bottom-0 -mx-4 mt-4 border-t hairline bg-white/96 px-4 pb-[calc(env(safe-area-inset-bottom)+0.35rem)] pt-3 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-4"
                      : "mt-4"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    {isTooShort ? (
                      <p className="text-[17px] text-[#AE5A39] sm:text-[16px]">Serve un po&apos; piu contesto.</p>
                    ) : (
                      <p className="text-[17px] text-black/38 sm:text-[16px]">20-280 caratteri</p>
                    )}

                    <button
                      type="button"
                      onClick={handleExample}
                      className={`text-[17px] font-medium text-black/56 transition hover:text-text sm:text-[16px] ${
                        keyboardOpen ? "sm:inline-flex" : "hidden"
                      }`}
                    >
                      Esempio
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="w-full rounded-full bg-text px-5 py-4 text-[20px] font-medium text-white transition hover:bg-[#262626] disabled:cursor-not-allowed disabled:bg-[#A6A199] sm:text-[18px]"
                  >
                    {isSubmitting ? "Un attimo..." : "Valuta il mio piano"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
