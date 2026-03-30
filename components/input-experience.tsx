"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useViewportMetrics } from "@/lib/use-viewport-metrics";
import {
  MAX_PLAN_LENGTH,
  MIN_PLAN_LENGTH,
  PLAN_SESSION_KEY,
  SAMPLE_INPUTS
} from "@/lib/analyze-plan";

const HOME_STARS = [
  { top: "6%", left: "8%", size: 2, delay: "0.2s", duration: "3.4s" },
  { top: "8%", left: "21%", size: 1.8, delay: "1.3s", duration: "3.8s" },
  { top: "10%", left: "36%", size: 2.4, delay: "0.8s", duration: "4.2s" },
  { top: "12%", left: "62%", size: 1.8, delay: "1.1s", duration: "4s" },
  { top: "7%", left: "78%", size: 2.2, delay: "2.1s", duration: "3.6s" },
  { top: "17%", left: "13%", size: 1.8, delay: "1.7s", duration: "3.5s" },
  { top: "20%", left: "70%", size: 2.4, delay: "0.9s", duration: "4.1s" },
  { top: "27%", left: "84%", size: 1.8, delay: "2.3s", duration: "3.9s" },
  { top: "33%", left: "17%", size: 2.2, delay: "0.4s", duration: "4.3s" },
  { top: "38%", left: "58%", size: 2, delay: "1.4s", duration: "3.4s" },
  { top: "44%", left: "8%", size: 1.8, delay: "2.5s", duration: "4.2s" },
  { top: "49%", left: "91%", size: 2.2, delay: "0.6s", duration: "3.7s" },
  { top: "58%", left: "28%", size: 2.4, delay: "1.9s", duration: "4.1s" },
  { top: "62%", left: "73%", size: 1.8, delay: "0.7s", duration: "3.8s" },
  { top: "71%", left: "15%", size: 2.1, delay: "1.2s", duration: "4.3s" },
  { top: "76%", left: "83%", size: 2.3, delay: "2.4s", duration: "3.6s" },
  { top: "84%", left: "10%", size: 1.9, delay: "0.5s", duration: "4.4s" },
  { top: "87%", left: "55%", size: 2.2, delay: "2s", duration: "3.5s" }
] as const;

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
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {HOME_STARS.map((star, index) => (
          <span
            key={`${star.left}-${star.top}-${index}`}
            className="space-star"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
              animationDuration: star.duration
            }}
          />
        ))}

        <div className={`space-planet-wrap ${keyboardOpen ? "opacity-35" : ""}`}>
          <div className="space-planet-glow" />
          <div className="space-planet" />
        </div>
      </div>

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
            <p className="space-home-top text-[18px] leading-none tracking-[-0.03em] text-[#D6C9BD] sm:text-[20px]">
              A brutally
            </p>
            <div className="space-y-0.5 leading-[0.9]">
              <p className="space-home-playful text-[62px] text-[#F39241] sm:text-[70px]">playful</p>
              <p className="space-home-reality text-[52px] text-[#F2EEE8] sm:text-[58px]">
                reality check
              </p>
            </div>
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
                className="rounded-full border border-[#F39241] bg-[#F39241]/10 px-6 py-3 text-[12px] font-medium uppercase tracking-[0.22em] text-[#F5EDE5] transition duration-300 hover:bg-[#F39241]/20 disabled:cursor-not-allowed disabled:border-white/12 disabled:bg-white/5 disabled:text-white/38"
              >
                {isSubmitting ? "Un attimo" : "Valuta il piano"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
