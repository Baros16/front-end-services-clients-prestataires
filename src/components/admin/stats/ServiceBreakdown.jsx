// src/components/admin/stats/ServiceBreakdown.jsx

import { Card } from '../../commons';

/**
 * Couleurs par catégorie — tokens définis dans tokens.css.
 * Fallback : --color-cat-autre si id inconnu.
 */
const CATEGORY_COLOR = {
  cat_plomberie:   'var(--color-cat-plomberie)',
  cat_electricite: 'var(--color-cat-electricite)',
  cat_nettoyage:   'var(--color-cat-nettoyage)',
  cat_serrurerie:  'var(--color-cat-serrurerie)',
  cat_peinture:    'var(--color-cat-peinture)',
  cat_autre:       'var(--color-cat-autre)',
};

function CategoryRow({ cat }) {
  const color = CATEGORY_COLOR[cat.id] ?? 'var(--color-cat-autre)';

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span
          className="text-sm"
          style={{ color: 'var(--color-sl-700)', fontFamily: 'var(--font-body)' }}
        >
          {cat.label}
        </span>
        <span
          className="text-sm font-semibold"
          style={{ color: 'var(--color-sl-900)', fontFamily: 'var(--font-body)' }}
        >
          {cat.percentageShare}%
        </span>
      </div>

      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 4, background: 'var(--color-sl-100)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width:      `${cat.percentageShare}%`,
            background: color,
            transition: 'width 0.7s ease',
          }}
        />
      </div>
    </div>
  );
}

export function ServiceBreakdown({ categories }) {
  return (
    <div style={{ width: 340, flexShrink: 0 }}>
      <Card title="Répartition par service">
        <div className="space-y-4">
          {categories.map(cat => (
            <CategoryRow key={cat.id} cat={cat} />
          ))}
        </div>
      </Card>
    </div>
  );
}