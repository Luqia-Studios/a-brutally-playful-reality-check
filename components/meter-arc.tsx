type MeterArcProps = {
  score: number;
  size?: "sm" | "lg";
  label?: string;
  showScale?: boolean;
};

function accentForScore(score: number) {
  if (score <= 30) {
    return "#BFB8AB";
  }

  if (score <= 60) {
    return "#D8A16A";
  }

  if (score <= 80) {
    return "#FF6B3D";
  }

  return "#E4572E";
}

export function MeterArc({
  score,
  size = "lg",
  label = "Indice di delirio",
  showScale = true
}: MeterArcProps) {
  const safeScore = Math.max(0, Math.min(100, score));
  const radius = size === "lg" ? 118 : 86;
  const centerX = size === "lg" ? 160 : 120;
  const centerY = size === "lg" ? 160 : 118;
  const strokeWidth = size === "lg" ? 14 : 11;
  const width = size === "lg" ? 320 : 240;
  const height = size === "lg" ? 210 : 156;
  const startX = centerX - radius;
  const endX = centerX + radius;
  const path = `M ${startX} ${centerY} A ${radius} ${radius} 0 0 1 ${endX} ${centerY}`;
  const angle = Math.PI - (safeScore / 100) * Math.PI;
  const dotX = centerX + radius * Math.cos(angle);
  const dotY = centerY - radius * Math.sin(angle);
  const accent = accentForScore(safeScore);

  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <div className="meter-glow absolute inset-x-8 top-5 h-40 rounded-full blur-2xl" />
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="relative z-10 w-full"
        role="img"
        aria-label={`${label}: ${safeScore} su 100`}
      >
        <path
          d={path}
          fill="none"
          stroke="rgba(17, 17, 17, 0.08)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength={100}
        />
        <path
          d={path}
          fill="none"
          stroke={accent}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${safeScore} 100`}
        />
        <circle cx={dotX} cy={dotY} r={size === "lg" ? 7 : 5.5} fill={accent} />
        <circle cx={dotX} cy={dotY} r={size === "lg" ? 14 : 10} fill={accent} opacity="0.14" />
      </svg>

      {showScale ? (
        <div className="mt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-black/38">
          <span>0</span>
          <span>100</span>
        </div>
      ) : null}
    </div>
  );
}
