// Line drawing for the bottom of the navy hero (brand v1.5): a quiet skyline around three arches
// taken from the logo. A drawing, not a photo; replace with a real photo of Qatari work when one exists.
const BUILDINGS = [
  // [x, width, height, window columns]
  [16, 64, 58, 0], [92, 52, 92, 2], [156, 74, 70, 3], [240, 46, 132, 2], [296, 62, 100, 3], [366, 40, 164, 0], [414, 64, 118, 2],
];
const GROUND = 220;
const TOWER = 164;

function Building([x, w, h, cols], mirror) {
  const left = mirror ? 1200 - x - w : x;
  const top = GROUND - h;
  const windows = Array.from({ length: cols }, (_, i) => left + ((i + 1) * w) / (cols + 1));
  return (
    <g key={`${mirror ? 'r' : 'l'}${x}`}>
      <rect x={left} y={top} width={w} height={h} />
      {windows.map((wx) => <line key={wx} x1={wx} y1={top + 14} x2={wx} y2={GROUND - 12} />)}
      {/* One pointed tower on the right keeps the line from feeling mirrored. */}
      {mirror && h === TOWER && <polyline points={`${left},${top} ${left + w / 2},${top - 26} ${left + w},${top}`} />}
    </g>
  );
}

const arch = (x, w, top) => `M${x} ${GROUND} V${top + w / 2} A${w / 2} ${w / 2} 0 0 1 ${x + w} ${top + w / 2} V${GROUND}`;

export default function HeroSkyline({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 1200 222" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke" strokeLinejoin="round">
        {BUILDINGS.map((b) => Building(b, false))}
        {BUILDINGS.map((b) => Building(b, true))}
        <path d={arch(490, 60, 100)} />
        <path d={arch(650, 60, 100)} />
        <path d={arch(560, 80, 46)} />
        <line x1="0" y1={GROUND} x2="1200" y2={GROUND} />
      </g>
      <path d={arch(576, 48, 86)} fill="none" stroke="var(--ml-on-navy-accent)" strokeOpacity="0.75" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
