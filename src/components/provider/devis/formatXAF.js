// src/components/provider/devis/formatXAF.js
// Formatage monétaire XAF cohérent avec la convention API_CONTRACT.md
// (devise XAF, valeurs entières, pas de décimales).

export function formatXAF(amount) {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `${new Intl.NumberFormat('fr-FR').format(safe)} XAF`;
}
