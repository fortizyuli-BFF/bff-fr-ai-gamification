type Props = {
  count: 5 | 6;
  skills: { name: string; score: number }[];
  size?: number;
  showLabels?: boolean;
};

const RING_PERCENTS = [0.25, 0.5, 0.75, 1];

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angle: number
): [number, number] {
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}

export function SkillPolygon({
  count,
  skills,
  size = 320,
  showLabels = true,
}: Props) {
  const padding = showLabels ? 64 : 16;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - padding;

  const angles = Array.from(
    { length: count },
    (_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / count
  );

  const outerVertices = angles.map((a) => polarToCartesian(cx, cy, radius, a));

  const scoreVertices = angles.map((a, i) => {
    const score = skills[i]?.score ?? 0;
    const r = (Math.max(0, Math.min(10, score)) / 10) * radius;
    return polarToCartesian(cx, cy, r, a);
  });

  const filledPath =
    scoreVertices.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ") +
    " Z";

  const ringPaths = RING_PERCENTS.map((p) =>
    angles
      .map((a, i) => {
        const [x, y] = polarToCartesian(cx, cy, radius * p, a);
        return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ") + " Z"
  );

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      role="img"
      aria-label={`Skill polygon with ${count} dimensions`}
      className="block"
    >
      {ringPaths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="var(--bff-gold)"
          strokeOpacity={i === RING_PERCENTS.length - 1 ? 0.45 : 0.18}
          strokeWidth={1}
        />
      ))}

      {outerVertices.map(([x, y], i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={x}
          y2={y}
          stroke="var(--bff-gold)"
          strokeOpacity={0.18}
          strokeWidth={1}
        />
      ))}

      <path
        d={filledPath}
        fill="var(--bff-gold)"
        fillOpacity={0.35}
        stroke="var(--bff-gold)"
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {scoreVertices.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={4}
          fill="var(--bff-black)"
          stroke="var(--bff-gold-soft)"
          strokeWidth={1.5}
        />
      ))}

      {showLabels &&
        outerVertices.map(([x, y], i) => {
          const skill = skills[i];
          if (!skill) return null;

          const dx = x - cx;
          const dy = y - cy;
          const isTop = dy < -radius * 0.6;
          const isBottom = dy > radius * 0.6;
          const isRight = dx > 4;
          const isLeft = dx < -4;

          const labelX = x + (isLeft ? -8 : isRight ? 8 : 0);
          const labelY = y + (isTop ? -10 : isBottom ? 18 : 4);
          const anchor: "start" | "middle" | "end" = isLeft
            ? "end"
            : isRight
              ? "start"
              : "middle";

          return (
            <g key={i}>
              <text
                x={labelX}
                y={labelY}
                textAnchor={anchor}
                className="font-display-caps"
                style={{
                  fontSize: 10,
                  fill: "var(--bff-black)",
                  letterSpacing: "0.05em",
                }}
              >
                {skill.name}
              </text>
              <text
                x={labelX}
                y={labelY + 12}
                textAnchor={anchor}
                style={{
                  fontSize: 11,
                  fill: "var(--bff-gold)",
                  fontWeight: 700,
                }}
              >
                {skill.score}
              </text>
            </g>
          );
        })}
    </svg>
  );
}

export function SkillPolygonOutline({
  count,
  size = 64,
}: {
  count: 5 | 6;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 4;
  const angles = Array.from(
    { length: count },
    (_, i) => -Math.PI / 2 + (i * 2 * Math.PI) / count
  );
  const verts = angles.map((a) => polarToCartesian(cx, cy, radius, a));
  const d =
    verts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ") +
    " Z";
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden>
      <path
        d={d}
        fill="var(--bff-gold-wash)"
        stroke="var(--bff-gold)"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}
