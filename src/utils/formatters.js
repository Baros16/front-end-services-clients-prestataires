// src/utils/formatters.js

export function formatMotif(motif) {
  if (!motif) return '';
  const lower = motif.toLowerCase().replace(/_/g, ' ');
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function formatMotifUpper(motif) {
  if (!motif) return '';
  return motif.replace(/_/g, ' ');
}
