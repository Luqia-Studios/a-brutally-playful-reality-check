"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/lib/brand";
import { SpaceBackdrop } from "@/components/space-backdrop";
import { SpaceWordmark } from "@/components/space-wordmark";
import { analyzePlan, PLAN_SESSION_KEY, type AnalysisResult } from "@/lib/analyze-plan";
import { useViewportMetrics } from "@/lib/use-viewport-metrics";

const LOADING_STEPS = [
  "Stiamo separando la visione dalla fantasia",
  "Misuriamo il livello di coraggio non supportato dai fatti",
  "Controlliamo danni emotivi e logistici",
  "Quasi fatto"
];

const LOADING_PROGRESS = [18, 44, 71, 93];

function useAnimatedNumber(target: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 920;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    setValue(0);
    frame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [target]);

  return value;
}

function indicatorAccent(value: number) {
  if (value <= 30) {
    return "#D6C9BD";
  }

  if (value <= 60) {
    return "#F0B06E";
  }

  if (value <= 80) {
    return "#F39241";
  }

  return "#FF6B3D";
}

function IndicatorTile({ label, value }: { label: string; value: number }) {
  const accent = indicatorAccent(value);

  return (
    <div className="rounded-[18px] border border-white/10 bg-[#0D0D0D] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[#B2A396]">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <span className="text-[25px] font-semibold leading-none tracking-[-0.04em] text-[#F4EDE5] sm:text-[28px]">
          {value}
        </span>
        <span className="text-[11px] uppercase tracking-[0.18em] text-[#998D83]">/100</span>
      </div>
      <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${value}%`, backgroundColor: accent }}
        />
      </div>
    </div>
  );
}

function LoadingScreen({ index }: { index: number }) {
  return (
    <main className="viewport-shell relative overflow-x-hidden overflow-y-auto bg-black text-[#F4EDE5]">
      <SpaceBackdrop />

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-[28rem] flex-col px-6 pb-10 pt-8 sm:max-w-[31rem] sm:px-8 sm:pb-12 sm:pt-10">
        <section className="mx-auto flex w-full max-w-[22rem] flex-1 flex-col items-center justify-center gap-6 text-center sm:max-w-[24rem]">
          <div className="animate-reveal" style={{ animationDelay: "120ms" }}>
            <SpaceWordmark compact />
          </div>

          <div className="animate-reveal flex flex-col items-center gap-3" style={{ animationDelay: "240ms" }}>
            <div className="space-rocket" />
            <div className="space-trail h-20 sm:h-24" />
          </div>

          <div
            className="w-full animate-reveal rounded-[24px] border border-white/10 bg-black/60 p-5 backdrop-blur-sm"
            style={{ animationDelay: "360ms" }}
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#A59689]">Analisi in corso</p>
            <p className="mt-3 text-[28px] leading-[1.08] tracking-[-0.04em] text-[#F4EDE5] sm:text-[32px]">
              {LOADING_STEPS[index]}
            </p>
            <div className="mt-5 h-[3px] overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#F39241] transition-[width] duration-500 ease-out"
                style={{ width: `${LOADING_PROGRESS[index]}%` }}
              />
            </div>
            <p className="mt-3 text-[12px] uppercase tracking-[0.18em] text-[#8E847C]">
              {LOADING_PROGRESS[index]} / 100
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export function ResultExperience() {
  const router = useRouter();
  useViewportMetrics();
  const shareResetRef = useRef<number | null>(null);
  const loadingIntervalRef = useRef<number | null>(null);
  const loadingTimeoutRef = useRef<number | null>(null);

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [shareState, setShareState] = useState<"idle" | "shared" | "copied">("idle");

  useEffect(() => {
    const storedPlan = sessionStorage.getItem(PLAN_SESSION_KEY);

    if (!storedPlan) {
      router.replace("/");
      return undefined;
    }

    loadingIntervalRef.current = window.setInterval(() => {
      setLoadingStep((current) => (current + 1) % LOADING_STEPS.length);
    }, 760);

    loadingTimeoutRef.current = window.setTimeout(() => {
      setResult(analyzePlan(storedPlan));

      if (loadingIntervalRef.current) {
        window.clearInterval(loadingIntervalRef.current);
      }
    }, 2800);

    return () => {
      if (shareResetRef.current) {
        window.clearTimeout(shareResetRef.current);
      }

      if (loadingIntervalRef.current) {
        window.clearInterval(loadingIntervalRef.current);
      }

      if (loadingTimeoutRef.current) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [router]);

  const animatedScore = useAnimatedNumber(result?.score ?? 0);

  const indicators = useMemo(() => {
    if (!result) {
      return [];
    }

    return [
      { label: "Realismo", value: result.indicatori.realismo },
      { label: "Impulsivita", value: result.indicatori.impulsivita },
      { label: "Danno economico", value: result.indicatori.dannoEconomico },
      { label: "Main character", value: result.indicatori.mainCharacterEnergy }
    ];
  }, [result]);

  const evaluationText = result ? result.verdict : "";

  function resetShareState() {
    if (shareResetRef.current) {
      window.clearTimeout(shareResetRef.current);
    }

    shareResetRef.current = window.setTimeout(() => {
      setShareState("idle");
    }, 2200);
  }

  async function copyPayload(payload: string, nextState: "shared" | "copied") {
    try {
      if (nextState === "shared" && typeof navigator.share === "function") {
        await navigator.share({
          title: APP_NAME,
          text: payload
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(payload);
      }

      setShareState(nextState);
      resetShareState();
    } catch {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(payload);
        setShareState(nextState);
        resetShareState();
      }
    }
  }

  function handleRetry() {
    sessionStorage.removeItem(PLAN_SESSION_KEY);
    router.push("/");
  }

  async function handleShare() {
    if (!result) {
      return;
    }

    await copyPayload(result.shareText, "shared");
  }

  async function handleCopyVerdict() {
    if (!result) {
      return;
    }

    await copyPayload(evaluationText, "copied");
  }

  if (!result) {
    return <LoadingScreen index={loadingStep} />;
  }

  return (
    <main className="viewport-shell relative overflow-x-hidden overflow-y-auto bg-black text-[#F4EDE5]">
      <SpaceBackdrop dimPlanet />

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-[30rem] flex-col px-3 py-3 sm:max-w-[34rem] sm:px-8 sm:py-8 lg:max-w-[74rem] lg:px-10">
        <section className="mx-auto flex w-full max-w-[23rem] flex-1 items-stretch text-center sm:max-w-[26rem] lg:max-w-[66rem] lg:text-left">
          <div
            className="animate-reveal flex h-full min-h-[calc(var(--app-height)-1.5rem)] max-h-[calc(var(--app-height)-1.5rem)] w-full flex-col justify-between overflow-hidden rounded-[28px] border border-white/8 bg-[#050505] p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_0_34px_rgba(243,146,65,0.08)] sm:p-5 lg:min-h-0 lg:max-h-none lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:gap-8"
            style={{ animationDelay: "140ms" }}
          >
            <div className="flex flex-col justify-between gap-3 lg:gap-6">
              <div className="space-y-1.5">
                <div className="flex items-end justify-center gap-2 lg:justify-start">
                  <span className="space-home-playful text-[88px] leading-none text-[#F39241] sm:text-[106px]">
                    {animatedScore}
                  </span>
                  <span className="pb-3 text-[14px] uppercase tracking-[0.18em] text-[#C8B9AA]">/100</span>
                </div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#A59689]">Indice di delirio</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#F5C393]">{result.categoria}</p>
              </div>

              <div className="rounded-[22px] border border-[#F39241] bg-[#090909] p-3.5 shadow-[0_0_0_1px_rgba(243,146,65,0.12),0_0_24px_rgba(243,146,65,0.06)]">
                <p className="text-[17px] italic leading-[1.32] tracking-[-0.02em] text-[#E8DED4] sm:text-[21px]">
                  {evaluationText}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-col justify-between gap-2.5 lg:mt-0">
              <div className="grid grid-cols-2 gap-2.5">
                {indicators.map((indicator) => (
                  <IndicatorTile key={indicator.label} label={indicator.label} value={indicator.value} />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-full border border-[#F39241] bg-[#F39241] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black shadow-[0_10px_28px_rgba(243,146,65,0.28)] transition duration-300 hover:bg-[#FFB066]"
                >
                  {shareState === "shared" ? "Risultato copiato" : "Condividi"}
                </button>
                <button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-full border border-white/14 bg-[#111111] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F5EDE5] transition duration-300 hover:bg-[#171717]"
                >
                  Un altro piano
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyVerdict}
                className="text-[11px] uppercase tracking-[0.18em] text-[#A59689] transition hover:text-[#F39241]"
              >
                {shareState === "copied" ? "Valutazione copiata" : "Copia la valutazione"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
