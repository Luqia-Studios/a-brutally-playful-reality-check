"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SpaceBackdrop } from "@/components/space-backdrop";
import { SpaceWordmark } from "@/components/space-wordmark";
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

  function submitPlan() {
    if (!isValid) {
      textareaRef.current?.focus();
      return;
    }

    sessionStorage.setItem(PLAN_SESSION_KEY, trimmed);
    setIsSubmitting(true);
    router.push("/risultato");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitPlan();
  }

  return (
    <main className="viewport-shell relative overflow-x-hidden overflow-y-auto bg-black text-[#F4EDE5]">
      <SpaceBackdrop dimPlanet={keyboardOpen} />

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-[28rem] flex-col px-6 pb-8 pt-8 sm:max-w-[31rem] sm:px-8 sm:pb-10 sm:pt-10 lg:max-w-[72rem] lg:px-10">
        <section
          className={`mx-auto flex w-full max-w-[22rem] flex-1 flex-col items-center text-center sm:max-w-[24rem] ${
            keyboardOpen ? "justify-start gap-4" : "justify-center gap-6"
          } lg:max-w-[26rem]`}
        >
          <div
            className={`space-y-2 ${keyboardOpen ? "animate-reveal pt-1" : "animate-reveal pt-4"}`}
            style={{ animationDelay: "120ms" }}
          >
            <SpaceWordmark />
          </div>

          <div
            className={`flex flex-col items-center ${keyboardOpen ? "gap-2" : "gap-3"} animate-reveal`}
            style={{ animationDelay: "260ms" }}
          >
            <div className="space-rocket" />
            <div className={`space-trail ${keyboardOpen ? "h-12" : "h-24 sm:h-28"}`} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="w-full animate-reveal"
            style={{ animationDelay: "360ms" }}
          >
            <div className="rounded-[18px] border border-[#F39241] bg-black/75 p-3 shadow-[0_0_0_1px_rgba(243,146,65,0.12),0_0_32px_rgba(243,146,65,0.1)] backdrop-blur-sm transition duration-300 focus-within:shadow-[0_0_0_1px_rgba(243,146,65,0.28),0_0_42px_rgba(243,146,65,0.14)]">
              <textarea
                ref={textareaRef}
                value={draft}
                maxLength={MAX_PLAN_LENGTH}
                rows={2}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    submitPlan();
                  }
                }}
                placeholder={SAMPLE_INPUTS[placeholderIndex].toLowerCase()}
                className="min-h-[92px] w-full resize-none bg-transparent px-1 py-1 text-left text-[19px] italic leading-8 tracking-[-0.02em] text-[#E8DED4] outline-none placeholder:text-[#8E847C] sm:min-h-[104px] sm:text-[22px]"
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 text-[12px] uppercase tracking-[0.18em] text-[#A59689]">
              <button
                type="button"
                onClick={handleExample}
                className="transition hover:text-[#F39241]"
              >
                Prova un esempio
              </button>
              <span>
                {trimmed.length}/{MAX_PLAN_LENGTH}
              </span>
            </div>

            {isTooShort ? (
              <p className="mt-2 text-left text-[12px] text-[#D88A61]">
                Serve un po&apos; piu contesto.
              </p>
            ) : null}

            <div className="mt-5 flex justify-center">
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="rounded-full border border-[#F39241] bg-[#F39241] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.22em] text-black shadow-[0_10px_28px_rgba(243,146,65,0.28)] transition duration-300 hover:bg-[#FFB066] disabled:cursor-not-allowed disabled:border-white/12 disabled:bg-white/8 disabled:text-white/36 disabled:shadow-none"
              >
                {isSubmitting ? "Un attimo" : "Valuta il tuo piano"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
