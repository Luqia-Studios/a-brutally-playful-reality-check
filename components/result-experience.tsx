"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { APP_NAME } from "@/lib/brand";
import { MeterArc } from "@/components/meter-arc";
import { analyzePlan, PLAN_SESSION_KEY, type AnalysisResult } from "@/lib/analyze-plan";
import { useViewportMetrics } from "@/lib/use-viewport-metrics";

const LOADING_STEPS = [
  "Stiamo separando la visione dalla fantasia",
  "Misuriamo il livello di coraggio non supportato dai fatti",
  "Controlliamo danni emotivi e logistici",
  "Quasi fatto"
];

const LOADING_PROGRESS = [18, 44, 71, 93];

function IndicatorRow({
  label,
  value,
  score
}: {
  label: string;
  value: number;
  score: number;
}) {
  const accent =
    score <= 30 ? "#BFB8AB" : score <= 60 ? "#D8A16A" : score <= 80 ? "#FF6B3D" : "#E4572E";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-black/58">{label}</span>
        <span className="font-medium text-text">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-black/6">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${accent} 0%, ${accent} 100%)`
          }}
        />
      </div>
    </div>
  );
}

function useAnimatedNumber(target: number) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 860;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const nextValue = Math.round(target * (1 - (1 - progress) * (1 - progress)));
      setValue(nextValue);

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

function LoadingScreen({ index }: { index: number }) {
  return (
    <main className="viewport-shell">
      <div className="mx-auto flex h-full max-w-6xl flex-col px-5 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
        <header className="flex items-center justify-between pb-4 sm:pb-5">
          <p className="brand-stack text-[15px] font-semibold text-text sm:max-w-none sm:text-base">{APP_NAME}</p>
          <p className="text-sm text-black/44">Analisi</p>
        </header>

        <section className="flex flex-1 items-center justify-center">
          <div className="surface-panel flex w-full max-w-3xl flex-col items-center rounded-[32px] px-5 py-8 text-center sm:px-8 sm:py-10">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="eyebrow text-[11px] text-black/34">Valutazione</p>
                <p className="font-display text-[30px] font-semibold leading-[1] tracking-[-0.05em] text-text sm:text-[38px]">
                  {LOADING_STEPS[index]}
                </p>
              </div>

              <MeterArc score={LOADING_PROGRESS[index]} label="Analisi in corso" showScale={false} />

              <div className="mx-auto h-1.5 w-full max-w-md overflow-hidden rounded-full bg-black/7">
                <div
                  className="h-full rounded-full bg-[#FF6B3D] transition-[width] duration-500 ease-out"
                  style={{ width: `${LOADING_PROGRESS[index]}%` }}
                />
              </div>

              <p className="text-sm text-black/40">{LOADING_PROGRESS[index]} / 100</p>
            </div>
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

  const [plan, setPlan] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [shareState, setShareState] = useState<"idle" | "shared" | "copied">("idle");

  useEffect(() => {
    const storedPlan = sessionStorage.getItem(PLAN_SESSION_KEY);

    if (!storedPlan) {
      router.replace("/");
      return undefined;
    }

    setPlan(storedPlan);

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
      { label: "Impulsività", value: result.indicatori.impulsivita },
      { label: "Danno economico", value: result.indicatori.dannoEconomico },
      { label: "Main character energy", value: result.indicatori.mainCharacterEnergy }
    ];
  }, [result]);

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

  function handleBackHome() {
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

    await copyPayload(`${result.verdict}. ${result.fraseFinale}`, "copied");
  }

  if (!result) {
    return <LoadingScreen index={loadingStep} />;
  }

  return (
    <main className="viewport-shell">
      <div className="mx-auto flex h-full max-w-6xl flex-col px-5 py-5 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
        <header className="flex items-center justify-between pb-4 sm:pb-5">
          <p className="brand-stack text-[15px] font-semibold text-text sm:max-w-none sm:text-base">{APP_NAME}</p>
          <button type="button" onClick={handleBackHome} className="text-sm text-black/48 transition hover:text-text">
            Torna all&apos;inizio
          </button>
        </header>

        <section className="flex min-h-0 flex-1 items-center">
          <div className="surface-panel grid h-full min-h-0 w-full gap-5 overflow-hidden rounded-[32px] p-4 sm:p-5 lg:grid-cols-[0.45fr_0.55fr] lg:gap-8 lg:rounded-[36px] lg:p-6">
            <div className="order-2 flex min-h-0 flex-col justify-between gap-4 lg:order-1 lg:gap-5">
              <div className="space-y-4">
                <div className="space-y-3">
                  <h1 className="max-w-[24rem] font-display text-[30px] font-semibold leading-[0.98] tracking-[-0.05em] text-text sm:text-[38px] lg:text-[48px]">
                    {result.verdict}
                  </h1>
                  <p className="max-w-[28rem] text-sm leading-7 text-black/62 sm:text-base">
                    {result.sintesi}
                  </p>
                  <p className="max-w-[26rem] text-[17px] leading-7 tracking-[-0.02em] text-text sm:text-[19px]">
                    {result.fraseFinale}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {result.tratti.map((trait) => (
                  <span
                    key={trait}
                    className="micro-chip rounded-full px-3 py-2 text-sm text-black/60"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="rounded-full bg-text px-5 py-4 text-sm font-medium text-white transition hover:bg-[#262626]"
                >
                  Prova un altro piano
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  className="rounded-full border hairline bg-white px-5 py-4 text-sm font-medium text-text transition hover:bg-[#FBFAF7]"
                >
                  {shareState === "shared" ? "Risultato copiato" : "Condividi"}
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyVerdict}
                className="w-fit text-sm font-medium text-black/52 transition hover:text-text lg:mt-auto"
              >
                {shareState === "copied" ? "Verdetto copiato" : "Copia il verdetto"}
              </button>
            </div>

            <div className="order-1 grid min-h-0 gap-4 lg:order-2 lg:grid-rows-[auto_auto_1fr]">
              <div className="grid grid-cols-[0.92fr_1.08fr] items-center gap-3 rounded-[28px] border hairline bg-[#FBFAF7] px-4 py-4 sm:px-5 sm:py-5">
                <div className="flex items-center justify-center">
                  <MeterArc score={animatedScore} size="sm" showScale={false} />
                </div>

                <div className="space-y-2">
                  <p className="eyebrow text-[11px] text-black/34">Indice di delirio</p>
                  <div className="flex items-end gap-2">
                    <span className="font-display text-[46px] font-semibold leading-none tracking-[-0.08em] text-text sm:text-[58px] lg:text-[70px]">
                      {animatedScore}
                    </span>
                    <span className="pb-2 text-sm text-black/42">/ 100</span>
                  </div>
                  <div className="inline-flex rounded-full border hairline bg-white px-3 py-2 text-sm text-black/60">
                    {result.categoria}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-[28px] border hairline bg-white px-4 py-4 sm:grid-cols-2">
                {indicators.map((indicator) => (
                  <IndicatorRow
                    key={indicator.label}
                    label={indicator.label}
                    value={indicator.value}
                    score={result.score}
                  />
                ))}
              </div>

              <div className="rounded-[24px] border hairline bg-[#FBFAF7] px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-black/34">La tua idea</p>
                <p className="mt-2 max-h-[96px] overflow-hidden text-sm leading-7 text-text sm:text-[15px]">
                  &ldquo;{plan}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
