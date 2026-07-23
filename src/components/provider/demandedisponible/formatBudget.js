// src/utils/formatBudget.js

export function formatBudget(d) {
  const min = d.budgetMin ?? d.estimatedBudget?.min ?? 0;
  const max = d.budgetMax ?? d.estimatedBudget?.max ?? 0;
  const fmt = (v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v);
  return `~${fmt(min)}-${fmt(max)} XAF`;
}