// src/components/provider/demandedisponible/sortUtils.js
export const SORT_OPTIONS = [
  { id: 'recent', label: 'Demande plus récente' },
  { id: 'budget', label: 'Budget (croissant)' },
  { id: 'rating', label: 'Meilleure note' },
];

export function sortDemands(demands, sortId) {
  const arr = [...demands];
  if (sortId === 'recent') {
    // audit 2.5 : postedMinutesAgo absent du schéma réel — on trie sur createdAt (réel)
    return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  if (sortId === 'budget') {
    return arr.sort((a, b) => (a.estimatedBudget?.min ?? 0) - (b.estimatedBudget?.min ?? 0));
  }
  if (sortId === 'rating') {
    // audit 2.5 : clientRating absent du DemandResponse réel — no-op tant que le backend
    // n'ajoute pas ce champ (agrégation cross-service nécessaire côté service-paiement/negociation)
    return arr.sort((a, b) => (b.clientRating ?? 0) - (a.clientRating ?? 0));
  }
  return arr;
}