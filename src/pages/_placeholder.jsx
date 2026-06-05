// src/pages/_placeholder.jsx
/**
 * PlaceholderPage
 * Page temporaire à utiliser pour toutes les routes
 * qui ne sont pas encore implémentées en S1.
 *
 * Usage dans AppRouter :
 *   const ClientDashboard = lazy(() => import("./_placeholder"));
 *
 * Ou mieux — créer un fichier par page qui réexporte PlaceholderPage :
 *   // src/pages/client/ClientDashboard.jsx
 *   export { default } from "../_placeholder";
 *
 * Chaque membre remplace son placeholder par la vraie page en S2.
 */
import { useLocation } from "react-router-dom";
import { Badge } from "../components/commons/Badge";

export default function PlaceholderPage() {
  const { pathname } = useLocation();

  // Extraire le nom de la page depuis l'URL
  const segments = pathname.split("/").filter(Boolean);
  const pageName = segments[segments.length - 1]
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const roleColors = {
    client:   { bg: "var(--color-brand-xlight)", border: "var(--color-brand)", text: "var(--color-brand)" },
    provider: { bg: "var(--color-brand-xlight)", border: "var(--color-brand)", text: "var(--color-brand)" },
    admin:    { bg: "#F1F5F9", border: "#334155", text: "#334155" },
  };
  const role = segments[0] ?? "client";
  const colors = roleColors[role] ?? roleColors.client;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: "60vh",
        gap: "14px",
        fontFamily: "var(--font-body)",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "44px" }}>🚧</span>

      <div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--color-sl-900)",
            margin: "0 0 6px",
          }}
        >
          {pageName ?? "Page en construction"}
        </h2>
        <p style={{ fontSize: "13px", color: "var(--color-sl-500)", margin: 0 }}>
          Cette page sera implémentée en Semaine 2.
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: "999px",
            background: colors.bg,
            color: colors.text,
            border: `1px solid ${colors.border}22`,
            fontFamily: "var(--font-body)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {pathname}
        </span>
        <Badge label="S2" variant="warning" />
      </div>
    </div>
  );
}
