// src/utils/geocoder.js
// Wrapper Nominatim (OpenStreetMap) — gratuit, sans clé API.
// Docs : https://nominatim.org/release-docs/develop/api/
//
// Contraintes Nominatim :
//   - Max 1 requête/seconde (géré par le debounce dans LocationPicker)
//   - Header User-Agent requis (identifie l'application)
//   - Pas de scraping massif — cache en mémoire pour éviter les doublons

const BASE_URL = 'https://nominatim.openstreetmap.org';
const HEADERS  = {
  'User-Agent':    'ServiLoc/1.0 (contact@serviloc.cm)',
  'Accept-Language': 'fr',
};

// Cache mémoire simple — réinitialisé à chaque rechargement de page
const CACHE = new Map();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function cacheKey(...args) {
  return args.join('|');
}

async function nominatimFetch(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Nominatim ${res.status}`);
  return res.json();
}

// ─── reverseGeocode ──────────────────────────────────────────────────────────

/**
 * Convertit des coordonnées en adresse lisible.
 *
 * @param {number} lat
 * @param {number} lng
 * @returns {Promise<string>} Adresse formatée en français, ex :
 *   "Quartier Commercial, Bafoussam, Région de l'Ouest, Cameroun"
 *   Retourne "Position sélectionnée" si Nominatim ne trouve rien.
 */
export async function reverseGeocode(lat, lng) {
  const key = cacheKey('rev', lat.toFixed(4), lng.toFixed(4));
  if (CACHE.has(key)) return CACHE.get(key);

  try {
    const url = `${BASE_URL}/reverse`
      + `?lat=${lat}&lon=${lng}`
      + `&format=jsonv2`
      + `&addressdetails=1`
      + `&countrycodes=cm`;

    const data = await nominatimFetch(url);

    // Construire une adresse courte lisible
    const a = data.address ?? {};
    const parts = [
      a.neighbourhood || a.suburb || a.quarter,
      a.city          || a.town   || a.village || a.county,
      a.state,
    ].filter(Boolean);

    const result = parts.length > 0
      ? parts.join(', ')
      : data.display_name ?? 'Position sélectionnée';

    CACHE.set(key, result);
    return result;

  } catch {
    return 'Position sélectionnée';
  }
}

// ─── forwardGeocode ──────────────────────────────────────────────────────────

/**
 * Convertit une adresse texte en coordonnées.
 *
 * @param {string} address  Ex : "Ngoa-Ekele, Yaoundé"
 * @returns {Promise<{ lat: number, lng: number } | null>}
 *   Retourne null si aucun résultat.
 */
export async function forwardGeocode(address) {
  const trimmed = address.trim();
  if (!trimmed) return null;

  const key = cacheKey('fwd', trimmed.toLowerCase());
  if (CACHE.has(key)) return CACHE.get(key);

  try {
    const url = `${BASE_URL}/search`
      + `?q=${encodeURIComponent(trimmed)}`
      + `&format=jsonv2`
      + `&limit=1`
      + `&countrycodes=cm`
      + `&addressdetails=1`;

    const data = await nominatimFetch(url);

    if (!data || data.length === 0) {
      CACHE.set(key, null);
      return null;
    }

    const result = {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };

    CACHE.set(key, result);
    return result;

  } catch {
    return null;
  }
}