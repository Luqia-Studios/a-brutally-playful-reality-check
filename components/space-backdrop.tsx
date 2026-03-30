"use client";

const SPACE_STARS = [
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

export function SpaceBackdrop({ dimPlanet = false }: { dimPlanet?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {SPACE_STARS.map((star, index) => (
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

      <div className={`space-planet-wrap ${dimPlanet ? "opacity-35" : ""}`}>
        <div className="space-planet-glow" />
        <div className="space-planet" />
      </div>
    </div>
  );
}
