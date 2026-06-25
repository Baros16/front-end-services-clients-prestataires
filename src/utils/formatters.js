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

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
