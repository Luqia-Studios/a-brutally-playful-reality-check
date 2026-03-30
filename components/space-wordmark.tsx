"use client";

export function SpaceWordmark({
  compact = false,
  className = ""
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-wordmark ${compact ? "space-wordmark-compact" : ""} ${className}`.trim()}>
      <p className="space-home-top text-[#D6C9BD]">A brutally</p>
      <div className="space-wordmark-stack">
        <p className="space-home-playful text-[#F39241]">playful</p>
        <p className="space-home-reality text-[#F2EEE8]">reality check</p>
      </div>
    </div>
  );
}
