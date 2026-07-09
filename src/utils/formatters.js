export function formatTime(isoString) {
  return new Date(isoString).toLocaleTimeString('fr-CM', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Douala',
  });
}
export function formatXAF(amount) {
if (amount == null) return "— XAF";
return new Intl.NumberFormat("fr-FR").format(amount) + " XAF";
} 
export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('fr-CM', {
    day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Africa/Douala',
  });
}