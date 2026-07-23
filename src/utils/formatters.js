export function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString('fr-CM', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Douala',
  });
}
export function formatXAF(value) {
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${m % 1 === 0 ? m : m.toFixed(1).replace(".", ",")}M XAF`;
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}k XAF`;
  }
  return `${value} XAF`;
}
export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('fr-CM', {
    day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Africa/Douala',
  });
}

// "2026-05-21T10:00:00+01:00" → "21 mai"
export function formatDateShort(isoString) {
  return new Intl.DateTimeFormat('fr-CM', {
    day:      'numeric',
    month:    'long',
    timeZone: 'Africa/Douala',
  }).format(new Date(isoString));
}

export function formatRelativeTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();

  const isSameDay = date.toDateString() === now.toDateString();
  if (isSameDay) return formatTime(isoString);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Hier";

  const isSameYear = date.getFullYear() === now.getFullYear();
  return new Intl.DateTimeFormat('fr-CM', {
    day: 'numeric',
    month: 'long',
    year: isSameYear ? undefined : 'numeric',
    timeZone: 'Africa/Douala',
  }).format(date);
}

// À ajouter dans src/utils/formatters.js
// new Date().toISOString() (5 min avant maintenant) → 5
export function getMinutesAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime();
  return Math.max(0, Math.round(diffMs / 60000));
}

export function formatBudgetRange(budget) {
  if (!budget) return '—';
  const fmt = (n) => n.toLocaleString('fr-FR');
  return `${fmt(budget.min)} — ${fmt(budget.max)} XAF`;
}
export function buildMissionDisplayTitle(mission) {
  if (!mission) return 'Mission';
  if (mission.title) return mission.title;
  const category = mission.category ?? 'Mission';
  const address = mission.location?.address;
  return address ? `${category} — ${address}` : category;
}
/**
 * Vérifie si un numéro est un mobile Orange Cameroun
 */
const MTN_PREFIXES    = ['650','651','652','653','654','670','671','672','673','674','675','676','677','678','679','680','681','682','683'];
const ORANGE_PREFIXES = ['640','655','656','657','658','659','686','687','688','689','690','691','692','693','694','695','696','697','698','699'];

export function isOrangeCM(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 12) return false;
  const prefix3 = digits.slice(3, 6); // 3 chiffres après "237"
  return ORANGE_PREFIXES.includes(prefix3);
}

export function isMTNCM(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 12) return false;
  const prefix3 = digits.slice(3, 6);
  return MTN_PREFIXES.includes(prefix3);
}

export function validateCamerounPhone(phone) {
  const digits = phone.replace(/\D/g, "");

  if (!phone.startsWith("+237")) {
    return { valid: false, message: "Le numéro doit commencer par +237", operator: null };
  }
  if (digits.length !== 12) {
    return { valid: false, message: `Le numéro doit contenir 9 chiffres (actuellement ${Math.max(digits.length - 3, 0)})`, operator: null };
  }

  const number = digits.slice(3); // 9 chiffres après "237"

  if (isOrangeCM(phone)) {
    return { valid: true, operator: 'orange_money', formatted: `+237 ${number.slice(0,3)} ${number.slice(3,6)} ${number.slice(6,9)}`, compact: number };
  }
  if (isMTNCM(phone)) {
    return { valid: true, operator: 'mtn_momo', formatted: `+237 ${number.slice(0,3)} ${number.slice(3,6)} ${number.slice(6,9)}`, compact: number };
  }
  return { valid: false, message: "Entrer un numéro Orange ou MTN valide", operator: null };
}
export function shortenName(fullName) {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstNames = parts.slice(0, -1).join(' ');
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${firstNames} ${lastInitial}.`;
}