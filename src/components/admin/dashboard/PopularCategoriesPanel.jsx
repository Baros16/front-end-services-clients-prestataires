// src/components/admin/dashboard/PopularCategoriesPanel.jsx

import { Card, ProgressBar } from "../../commons";

/**
 * PopularCategoriesPanel
 *
 * Panneau "Catégories populaires".
 * Chaque catégorie : label + ProgressBar + pourcentage.
 * Réutilisable dans la page Statistiques (même shape de données).
 *
 * @param {{
 *   categories: CategoryStat[],
 * }} props
 *
 * @typedef {{ name: string, percentage: number, color: string }} CategoryStat
 */
export default function PopularCategoriesPanel({ categories }) {
  return (
    <Card title="Catégories populaires">
      <div className="flex flex-col gap-3">
        {categories.map((cat) => (
          <ProgressBar
            key={cat.name}
            label={cat.name}
            value={cat.percentage}
          />
        ))}
      </div>
    </Card>
  );
}
