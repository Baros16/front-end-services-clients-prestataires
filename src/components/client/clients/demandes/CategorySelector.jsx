// src/components/client/clients/demandes/CategorySelector.jsx
import { useState } from 'react';
import { ServiceCategoryCard } from '../../../commons/ServiceCategoryCard';
import { Wrench, Zap, Brush, Key, Sparkles, Plus } from '../../../commons/Icons';
import mockCategories from '../../../../data/shared/mock_categories.json';

const ICON_MAP = {
  wrench: <Wrench   size={24} strokeWidth={1.8} color="var(--color-cat-plomberie)" />,
  bolt:   <Zap      size={24} strokeWidth={1.8} color="var(--color-cat-electricite)" />,
  broom:  <Brush    size={24} strokeWidth={
    1.8} color="var(--color-cat-peinture)" />,
  key:    <Key      size={24} strokeWidth={1.8} color="var(--color-cat-serrurerie)" />,
  brush:  <Sparkles size={24} strokeWidth={1.8} color="var(--color-cat-netoyage)" />,
  plus:   <Plus     size={24} strokeWidth={1.8} color="var(--color-cat)" />,
};

// Nombre de cartes visibles avant d'afficher la carte "+" de repli
const VISIBLE_LIMIT = 5;

export default function CategorySelector({ categories, selectedId, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  const list = (categories && categories.length > 0) ? categories : mockCategories.data ?? mockCategories;

  if (!list || list.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--color-sl-400)] text-sm">
        Chargement des catégories…
      </div>
    );
  }

  const hasMore = list.length > VISIBLE_LIMIT;
  // Si on n'est pas déplié et qu'il y a plus d'éléments que la limite,
  // on laisse une place pour la carte "+" (VISIBLE_LIMIT - 1 catégories réelles).
  const displayList = expanded || !hasMore ? list : list.slice(0, VISIBLE_LIMIT - 1);

  return (
    <div>
      <p className="text-[11px] font-semibold tracking-widest text-[var(--color-sl-500)] uppercase mb-3">
        Catégorie de service
      </p>
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {displayList.map((cat) => {
          const label = cat.label ?? cat.name ?? '—';
          const icon  = cat.iconKey
            ? (ICON_MAP[cat.iconKey] ?? ICON_MAP.plus)
            : (cat.icon
                ? <span style={{ fontSize: 20, lineHeight: 1 }}>{cat.icon}</span>
                : ICON_MAP.plus);
          return (
            <ServiceCategoryCard
              key={cat.id}
              category={{
                id:    cat.id,
                label,
                icon,
                color: cat.color,
              }}
              selected={selectedId === cat.id}
              onClick={onSelect}
              size="md"
            />
          );
        })}

        {/* Carte "+" : révèle le reste des catégories non affichées, ne sélectionne rien */}
        {hasMore && !expanded && (
          <ServiceCategoryCard
            key="__more__"
            category={{
              id: '__more__',
              label: `+${list.length - (VISIBLE_LIMIT - 1)}`,
              icon: ICON_MAP.plus,
            }}
            selected={false}
            onClick={() => setExpanded(true)}
            size="md"
          />
        )}
      </div>
    </div>
  );
}