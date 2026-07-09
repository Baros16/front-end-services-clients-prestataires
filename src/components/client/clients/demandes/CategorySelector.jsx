// src/components/provider/demandes/CategorySelector.jsx
import { ServiceCategoryCard } from '../../../commons/ServiceCategoryCard';
import { Wrench, Zap, Brush, Key, Sparkles, Plus } from '../../../commons/Icons';
import mockCategories from '../../../../data/shared/mock_categories.json';

const ICON_MAP = {
  wrench: <Wrench   size={24} strokeWidth={1.8} color="var(--color-sl-700)" />,
  bolt:   <Zap      size={24} strokeWidth={1.8} color="var(--color-sl-700)" />,
  broom:  <Brush    size={24} strokeWidth={1.8} color="var(--color-sl-700)" />,
  key:    <Key      size={24} strokeWidth={1.8} color="var(--color-sl-700)" />,
  brush:  <Sparkles size={24} strokeWidth={1.8} color="var(--color-sl-700)" />,
  plus:   <Plus     size={24} strokeWidth={1.8} color="var(--color-sl-700)" />,
};

export default function CategorySelector({ categories, selectedId, onSelect }) {
  const list = (categories && categories.length > 0) ? categories : mockCategories.data ?? mockCategories;

  if (!list || list.length === 0) {
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
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        {list.map((cat) => {
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
      </div>
    </div>
  );
}