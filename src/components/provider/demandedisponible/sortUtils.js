export const SORT_OPTIONS = [
  { id: 'recent', label: 'Demande plus récente' },
  { id: 'budget', label: 'Budget (croissant)' },
  { id: 'rating', label: 'Meilleure note' },
];

export function sortDemands(demands, sortId) {
  const arr = [...demands];
  if (sortId === 'recent') return arr.sort((a, b) => (a.postedMinutesAgo ?? 0) - (b.postedMinutesAgo ?? 0));
  if (sortId === 'budget') return arr.sort((a, b) => (a.estimatedBudget?.min ?? 0) - (b.estimatedBudget?.min ?? 0));
  if (sortId === 'rating') return arr.sort((a, b) => (b.clientRating ?? 0) - (a.clientRating ?? 0));
  return arr;
}