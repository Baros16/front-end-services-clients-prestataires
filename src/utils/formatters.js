export function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString('fr-CM', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Douala',
  });
}
export function formatXAF(amount) {
if (amount == null) return "— XAF";
return new Intl.NumberFormat("fr-FR").format(amount) + " XAF";
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