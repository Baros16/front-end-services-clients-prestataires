// src/components/provider/demandes/CategorySelector.jsx
import { ServiceCategoryCard } from '../../../commons/ServiceCategoryCard';
import { Wrench, Zap, Brush, Key, Sparkles, Plus } from '../../../commons/Icons';

const ICON_MAP = {
  wrench: <Wrench   size={24} strokeWidth={1.8} color="var(--color-sl-700)" />,
  bolt:   <Zap      size={24} strokeWidth={1.8} color="var(--color-sl-700)" />,
  broom:  <Brush    size={24} strokeWidth={1.8} color="var(--color-sl-700)" />,
  key:    <Key      size={24} strokeWidth={1.8} color="var(--color-sl-700)" />,
  brush:  <Sparkles size={24} strokeWidth={1.8} color="var(--color-sl-700)" />,
  plus:   <Plus     size={24} strokeWidth={1.8} color="var(--color-sl-700)" />,
};

export default function CategorySelector({ categories, selectedId, onSelect }) {
  console.log('categories reçues:', categories);
  console.log('ICON_MAP keys:', Object.keys(ICON_MAP));

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--color-sl-400)] text-sm">
        Chargement des catégories…
      </div>
    );
  }

  return (
    <div>
      <p className="text-[11px] font-semibold tracking-widest text-[var(--color-sl-500)] uppercase mb-3">
        Catégorie de service
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {categories.map((cat) => {
          console.log('cat.iconKey:', cat.iconKey, '→ icône:', ICON_MAP[cat.iconKey]);
          return (
            <ServiceCategoryCard
              key={cat.id}
              category={{
                id:    cat.id,
                label: cat.label,
                icon:  ICON_MAP[cat.iconKey] ?? ICON_MAP.plus,
                color: cat.color,
              }}
              selected={selectedId === cat.id}
              onClick={onSelect}
              size="md"
            />
          );
        })}
      </div>
    </div>
  );
}