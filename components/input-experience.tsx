"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/lib/brand";
import { MeterArc } from "@/components/meter-arc";
import { useViewportMetrics } from "@/lib/use-viewport-metrics";
import {
  MAX_PLAN_LENGTH,
  MIN_PLAN_LENGTH,
  PLAN_SESSION_KEY,
  SAMPLE_INPUTS
} from "@/lib/analyze-plan";

const MAX_TEXTAREA_HEIGHT = 220;

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

  useEffect(() => {
    const element = textareaRef.current;

    if (!element) {
      return;
    }

    element.style.height = "0px";
    const nextHeight = Math.max(116, Math.min(element.scrollHeight, MAX_TEXTAREA_HEIGHT));
    element.style.height = `${nextHeight}px`;
    element.style.overflowY = element.scrollHeight > MAX_TEXTAREA_HEIGHT ? "auto" : "hidden";
  }, [draft]);

  const trimmed = draft.trim();
  const isTooShort = trimmed.length > 0 && trimmed.length < MIN_PLAN_LENGTH;
  const isValid = trimmed.length >= MIN_PLAN_LENGTH;
  const previewScore =
    trimmed.length === 0 ? 62 : Math.max(18, Math.min(94, Math.round(trimmed.length * 0.33 + 18)));

  function handleExample() {
    const nextExample = SAMPLE_INPUTS[exampleIndex % SAMPLE_INPUTS.length];
    setDraft(nextExample);
    setExampleIndex((current) => current + 1);
    textareaRef.current?.focus();
  }

  function handleSamplePick(sample: string) {
    setDraft(sample);
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
        className={`mx-auto flex max-w-6xl flex-col px-5 sm:px-8 lg:px-10 ${
          keyboardOpen ? "min-h-full py-4 sm:py-6 lg:py-8" : "h-full py-5 sm:py-6 lg:py-8"
        }`}
      >
        <header className={`flex items-center justify-between ${keyboardOpen ? "pb-3" : "pb-4 sm:pb-5"}`}>
          <p className="brand-stack text-[15px] font-semibold text-text sm:max-w-none sm:text-base">{APP_NAME}</p>
          <p className="text-xs uppercase tracking-[0.18em] text-black/34 sm:text-sm sm:normal-case sm:tracking-normal">
            Esperimento 01
          </p>
        </header>

        <section
          className={`grid min-h-0 flex-1 ${
            keyboardOpen
              ? "items-start gap-4 sm:gap-6 lg:items-center lg:gap-14"
              : "content-start gap-5 sm:gap-8 lg:items-center lg:gap-14"
          } lg:grid-cols-[0.44fr_0.56fr]`}
        >
          <div
            className={`flex min-h-0 flex-col ${
              keyboardOpen ? "justify-start gap-3" : "justify-between gap-5 lg:justify-center lg:gap-6"
            }`}
          >
            <div className={`${keyboardOpen ? "space-y-2" : "space-y-3 sm:space-y-4"}`}>
              <div className="max-w-[31rem] space-y-3">
                <h1
                  className={`font-display font-semibold leading-[0.94] tracking-[-0.06em] text-text ${
                    keyboardOpen ? "text-[32px] sm:text-[44px] lg:text-[68px]" : "text-[46px] sm:text-[56px] lg:text-[68px]"
                  }`}
                >
                  Quanto è delirante il tuo piano?
                </h1>
                <p className={`text-black/48 ${keyboardOpen ? "text-sm leading-5 sm:text-base sm:leading-6" : "text-sm leading-6 sm:text-base"}`}>
                  Scrivilo. Vediamo.
                </p>
              </div>
            </div>

            {!keyboardOpen ? (
              <div className="grid gap-3 rounded-[28px] border hairline bg-white/72 p-4 lg:hidden">
                <div className="flex flex-wrap gap-2">
                  <span className="micro-chip rounded-full px-3 py-2 text-xs uppercase tracking-[0.16em] text-black/42">
                    rapido
                  </span>
                  <span className="micro-chip rounded-full px-3 py-2 text-xs uppercase tracking-[0.16em] text-black/42">
                    0-100
                  </span>
                  <span className="micro-chip rounded-full px-3 py-2 text-xs uppercase tracking-[0.16em] text-black/42">
                    share
                  </span>
                </div>

                <div className="grid grid-cols-[1.08fr_0.92fr] items-end gap-3">
                  <div className="space-y-2">
                    <p className="eyebrow text-[11px] text-black/34">Preview</p>
                    <p className="text-sm leading-6 text-black/56">
                      Un piano entra. Un verdetto esce.
                    </p>
                  </div>
                  <div className="flex items-center justify-end">
                    <MeterArc score={previewScore} size="sm" label="Anteprima" showScale={false} />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="hidden lg:block">
              <MeterArc score={64} size="sm" label="Anteprima" showScale={false} />
            </div>
          </div>

          <div className="flex min-h-0 items-start lg:h-full lg:items-center lg:justify-end">
            <div className="surface-panel flex min-h-[min(54svh,35rem)] w-full flex-col rounded-[30px] p-4 sm:min-h-0 sm:p-5 lg:max-w-[37rem] lg:rounded-[34px] lg:p-6">
              <div className={`flex h-full flex-col ${keyboardOpen ? "gap-3" : "gap-4"}`}>
                <div className="grid grid-cols-[1fr_126px] items-center gap-3 rounded-[24px] border hairline bg-[#FBFAF7] p-3 sm:grid-cols-[1fr_auto] sm:p-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-full bg-text px-4 py-2 text-sm font-medium text-white"
                      >
                        Testo
                      </button>
                      <button
                        type="button"
                        disabled
                        className="rounded-full border hairline bg-white px-4 py-2 text-sm text-black/38"
                      >
                        Voce
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="micro-chip rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-black/42">
                        mobile first
                      </span>
                      <span className="micro-chip rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-black/42">
                        score
                      </span>
                    </div>
                  </div>

                  <div className="min-w-[118px] sm:min-w-[104px]">
                    <MeterArc score={previewScore} size="sm" label="Anteprima" showScale={false} />
                  </div>
                </div>

                <form className="flex h-full flex-col gap-4" onSubmit={handleSubmit}>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-4">
                      <label htmlFor="plan" className="text-sm font-medium text-text">
                        Il tuo piano
                      </label>
                      <span className="text-xs uppercase tracking-[0.18em] text-black/30">
                        {trimmed.length}/{MAX_PLAN_LENGTH}
                      </span>
                    </div>

                    <textarea
                      id="plan"
                      ref={textareaRef}
                      value={draft}
                      maxLength={MAX_PLAN_LENGTH}
                      rows={4}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder={SAMPLE_INPUTS[placeholderIndex]}
                      className={`w-full resize-none rounded-[26px] border hairline bg-[#FBFAF7] px-5 tracking-[-0.01em] text-text outline-none transition placeholder:text-black/28 focus:border-[#D8D1C6] focus:bg-white ${
                        keyboardOpen
                          ? "py-4 text-[17px] leading-7"
                          : "min-h-[168px] py-5 text-[18px] leading-8 sm:min-h-0 sm:py-4 sm:text-[17px] sm:leading-7"
                      }`}
                    />
                  </div>

                  <div
                    className={`flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                      keyboardOpen ? "hidden sm:flex" : ""
                    }`}
                  >
                    {SAMPLE_INPUTS.map((sample) => (
                      <button
                        key={sample}
                        type="button"
                        onClick={() => handleSamplePick(sample)}
                        className="shrink-0 rounded-full border hairline bg-white px-3 py-2 text-sm text-black/56 transition hover:text-text"
                      >
                        {sample}
                      </button>
                    ))}
                  </div>

                  <div
                    className={`space-y-3 ${
                      keyboardOpen
                        ? "sticky bottom-0 -mx-4 border-t hairline bg-white/96 px-4 pb-[calc(env(safe-area-inset-bottom)+0.35rem)] pt-3 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-0"
                        : "mt-auto"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={handleExample}
                        className="text-sm font-medium text-black/56 transition hover:text-text"
                      >
                        Prova un esempio
                      </button>
                      {isTooShort ? (
                        <p className="text-right text-sm text-[#AE5A39]">
                          Serve un po&apos; più contesto. Così è solo caos.
                        </p>
                      ) : (
                        <div className="text-right text-sm text-black/38">20-280 caratteri</div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className="w-full rounded-full bg-text px-5 py-4 text-sm font-medium text-white transition hover:bg-[#262626] disabled:cursor-not-allowed disabled:bg-[#A6A199]"
                    >
                      {isSubmitting ? "Un attimo..." : "Valuta il mio piano"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
