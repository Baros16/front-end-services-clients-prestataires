// src/utils/geo.js

/**
 * Distance à vol d'oiseau entre deux coordonnées GPS (formule de Haversine).
 * @returns {number} distance en kilomètres, arrondie à 1 décimale
 */
export function getDistanceKm(lat1, lng1, lat2, lng2) {
  if ([lat1, lng1, lat2, lng2].some((v) => typeof v !== 'number' || Number.isNaN(v))) {
    return null;
  }
  const R = 6371; // rayon moyen de la Terre en km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

// Seuil métier pour distinguer "zone prioritaire" / "zones éloignées"
export const PRIORITY_ZONE_KM = 10;