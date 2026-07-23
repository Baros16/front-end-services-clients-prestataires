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
export function isOrangeCM(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 5) return false;
  const afterPrefix = digits.slice(4);
  // Orange : 65, 66, 67, 68, 69, 650, 651, 652, etc.
  return /^6[5-9]/.test(afterPrefix);
}

/**
 * Vérifie si un numéro est un mobile MTN Cameroun
 */
export function isMTNCM(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 5) return false;
  const afterPrefix = digits.slice(4);
  // MTN : 65, 66, 67, 68, 69
  return /^6[5-9]/.test(afterPrefix);
}

/**
 * Valide un numéro de téléphone camerounais complet
 */
export function validateCamerounPhone(phone) {
  // Nettoyer le numéro
  const digits = phone.replace(/\D/g, "");
  
  // Vérifier le préfixe +237
  if (!phone.startsWith("+237")) {
    return { 
      valid: false, 
      message: "Le numéro doit commencer par +237",
      operator: null 
    };
  }
  
  // Vérifier la longueur totale (12 = +237 + 9 chiffres)
  if (digits.length !== 12) {
    return { 
      valid: false, 
      message: `Le numéro doit contenir 9 chiffres (actuellement ${digits.length - 4})`,
      operator: null 
    };
  }
  
  // Extraire les chiffres après +237
  const number = digits.slice(4);
  const firstDigit = number[0];
  
  // Vérifier le premier chiffre
  if (!["7","5","8","9"].includes(firstDigit)) {
    return { 
      valid: false, 
      message: "Entrer un numero Orange ou MTN valide",
      operator: null 
    };
  }
  
  return { 
    valid: true, 
    formatted: `+237 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 9)}`,
    compact: number,
  };
}

export function shortenName(fullName) {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstNames = parts.slice(0, -1).join(' ');
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${firstNames} ${lastInitial}.`;
}