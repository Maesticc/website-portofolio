
const ACCENT = '150, 176, 235'; // biru keunguan lembut, dipakai bersama

const CONSTELLATION_NODES = [
  [14, 26], [30, 40], [22, 66], [44, 58], [58, 30],
  [70, 52], [84, 38], [78, 72], [62, 80], [40, 84],
];
const CONSTELLATION_EDGES = [
  [0, 1], [1, 2], [1, 3], [3, 4], [4, 5],
  [5, 6], [5, 7], [7, 8], [8, 9], [3, 8],
];

export function ConstellationFX() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke={`rgba(${ACCENT},0.16)`} strokeWidth="0.12">
          {CONSTELLATION_EDGES.map(([a, b], i) => (
            <line
              key={i}
              x1={CONSTELLATION_NODES[a][0]}
              y1={CONSTELLATION_NODES[a][1]}
              x2={CONSTELLATION_NODES[b][0]}
              y2={CONSTELLATION_NODES[b][1]}
            />
          ))}
        </g>
        {CONSTELLATION_NODES.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="0.9" fill={`rgba(${ACCENT},0.1)`} />
            <circle cx={x} cy={y} r="0.35" fill={`rgba(210, 228, 255, 0.7)`} />
          </g>
        ))}
      </svg>
    </div>
  );
}

const WORLDS = [
  { x: '12%', y: '22%', s: 46, from: '#3a4763', glow: 0.16 },
  { x: '82%', y: '30%', s: 30, from: '#37425c', glow: 0.12 },
  { x: '68%', y: '74%', s: 18, from: '#2f3950', glow: 0.1 },
  { x: '26%', y: '80%', s: 12, from: '#333d54', glow: 0.1 },
];

export function DistantWorldsFX() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {WORLDS.map((wld, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: wld.x,
            top: wld.y,
            width: wld.s,
            height: wld.s,
            background: `radial-gradient(circle at 32% 30%, ${wld.from} 0%, #141a26 62%, #0b0e16 100%)`,
            boxShadow: `inset ${wld.s * 0.12}px ${wld.s * 0.08}px ${wld.s * 0.24}px -${wld.s * 0.1}px rgba(${ACCENT},0.5), 0 0 ${wld.s * 1.6}px -${wld.s * 0.3}px rgba(${ACCENT},${wld.glow})`,
          }}
        />
      ))}
    </div>
  );
}

const ORBITS = [
  { cx: 50, cy: 50, rx: 46, ry: 20, rot: -14, o: 0.14, dots: [0.12, 0.55, 0.86] },
  { cx: 50, cy: 50, rx: 34, ry: 13, rot: -14, o: 0.1, dots: [0.3, 0.72] },
  { cx: 50, cy: 50, rx: 22, ry: 8, rot: -14, o: 0.08, dots: [0.5] },
];

function orbitPoint(o, t) {
  const a = t * Math.PI * 2;
  const x = o.rx * Math.cos(a);
  const y = o.ry * Math.sin(a);
  const r = (o.rot * Math.PI) / 180;
  return {
    x: o.cx + x * Math.cos(r) - y * Math.sin(r),
    y: o.cy + x * Math.sin(r) + y * Math.cos(r),
  };
}

export function OrbitPathsFX() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {ORBITS.map((o, i) => (
          <g key={i}>
            <ellipse
              cx={o.cx}
              cy={o.cy}
              rx={o.rx}
              ry={o.ry}
              fill="none"
              stroke={`rgba(${ACCENT},${o.o})`}
              strokeWidth="0.12"
              transform={`rotate(${o.rot} ${o.cx} ${o.cy})`}
            />
            {o.dots.map((t, j) => {
              const p = orbitPoint(o, t);
              return (
                <g key={j}>
                  <circle cx={p.x} cy={p.y} r="0.8" fill={`rgba(${ACCENT},0.14)`} />
                  <circle cx={p.x} cy={p.y} r="0.32" fill="rgba(210, 228, 255, 0.7)" />
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}

export function SignalFX() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 [background:radial-gradient(80%_70%_at_50%_45%,rgba(4,5,12,0.55),rgba(4,5,12,0.2)_60%,transparent_100%)]" />

      <div className="sf-signal absolute left-1/2 top-[42%] h-1.5 w-1.5 -translate-x-1/2 rounded-full" />
    </div>
  );
}
