// src/components/admin/stats/MissionChart.jsx

import { Card } from '../../commons';

const CHART_H   = 160;
const PAD       = { top: 16, right: 16, bottom: 32, left: 16 };
const TICK_DAYS = [1, 5, 8, 10, 12, 15, 17, 19, 21, 22, 23];
const VB_W      = 100; // viewBox unité relative

export function MissionChart({ points, period }) {
  if (!points?.length) return null;

  const innerW  = VB_W - PAD.left - PAD.right;
  const innerH  = CHART_H - PAD.top - PAD.bottom;
  const maxVal  = Math.max(...points.map(p => p.value), 1);

  function toX(day) {
    return PAD.left + ((day - 1) / (points.length - 1)) * innerW;
  }
  function toY(val) {
    return PAD.top + innerH - (val / maxVal) * innerH;
  }

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.day)} ${toY(p.value)}`)
    .join(' ');

  const areaD = [
    pathD,
    `L ${toX(points.at(-1).day)} ${PAD.top + innerH}`,
    `L ${toX(points[0].day)}    ${PAD.top + innerH}`,
    'Z',
  ].join(' ');

  return (
    <Card title={`Évolution des missions — ${period}`} noPadding={false}>
      <svg
        viewBox={`0 0 ${VB_W} ${CHART_H}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: CHART_H, overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="slChartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--color-brand)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0"    />
          </linearGradient>
        </defs>

        {/* Grille horizontale */}
        {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
          <line
            key={ratio}
            x1={PAD.left}       y1={PAD.top + innerH * (1 - ratio)}
            x2={VB_W - PAD.right} y2={PAD.top + innerH * (1 - ratio)}
            stroke="var(--color-sl-100)"
            strokeWidth="0.4"
          />
        ))}

        {/* Aire */}
        <path d={areaD} fill="url(#slChartGrad)" />

        {/* Courbe */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Labels axe X */}
        {points
          .filter(p => TICK_DAYS.includes(p.day))
          .map(p => (
            <text
              key={p.day}
              x={toX(p.day)}
              y={PAD.top + innerH + 14}
              textAnchor="middle"
              fontSize="4"
              fill="var(--color-sl-400)"
              fontFamily="var(--font-body)"
            >
              {p.label}
            </text>
          ))
        }
      </svg>
    </Card>
  );
}