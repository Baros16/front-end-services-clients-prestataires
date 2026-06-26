// src/utils/formatters.js
/**
* Formate un montant en XAF
* ex: 55000 → "55 000 XAF"
*/
export function formatXAF(amount) {
if (amount == null) return "— XAF";
return new Intl.NumberFormat("fr-FR").format(amount) + " XAF";
} /*
*
* Formate une date ISO en date courte
* ex: "2026-05-21T08:00:00+01:00" → "21 mai"
*/
export function formatDate(isoStr) {
if (!isoStr) return "—";
const date = new Date(isoStr);
const day = date.getDate();
const months = [
"jan", "fév", "mar", "avr", "mai", "jun",
"jul", "aoû", "sep", "oct", "nov", "déc"
];
return day + " " + months[date.getMonth()];
} /*
*
* Formate une heure ISO
* ex: "2026-05-21T09:15:00+01:00" → "09:15"
*/
export function formatTime(isoStr) {
if (!isoStr) return "—";
const date = new Date(isoStr);
return date.getHours().toString().padStart(2, "0") + ":" +
date.getMinutes().toString().padStart(2, "0");
}