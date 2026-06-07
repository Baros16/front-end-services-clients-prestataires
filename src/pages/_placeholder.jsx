import { useLocation } from "react-router-dom";
import { Badge } from "../components/commons/Badge";

// Extraction et centralisation des données du planning d'équipe (v2)
const PLANNING_DATA = {
  // --- Espace Authentification ---
  "/auth/inscription": { id: "01", week: "S2", priority: "P1", dev: "M2 · Tresor", title: "Inscription / Connexion" },
  "/auth/connexion": { id: "01", week: "S2", priority: "P1", dev: "M2 · Tresor", title: "Inscription / Connexion" },
  "/auth/otp": { id: "02", week: "S2", priority: "P1", dev: "M2 · Tresor", title: "Vérification OTP" },
  "/auth/admin-login": { id: "03", week: "S2", priority: "P1", dev: "M5 · Patricia", title: "Connexion Admin" },
  "/auth/service-client-login": { id: "04", week: "S2", priority: "P1", dev: "M7 · Marcelle", title: "Connexion Service Client" },

  // --- Espace Client ---
  "/client/dashboard": { id: "05", week: "S2", priority: "P1", dev: "M6 · Cynthia", title: "Dashboard Client" },
  "/client/nouvelle-demande": { id: "06", week: "S2", priority: "P1", dev: "M3 · Archange", title: "Nouvelle Demande" },
  "/client/chat": { id: "07", week: "S2", priority: "P2", dev: "M8 · Zynelle", title: "Chat Client-Prestataire" },
  "/client/quote-detail": { id: "08", week: "S3", priority: "P2", dev: "M7 · Marcelle", title: "Devis (vue client)" },
  "/client/mission-tracking": { id: "09", week: "S2/S3", priority: "P2", dev: "M5 · Patricia / M2 · Tresor", title: "Suivi de Mission" },
  "/client/rating": { id: "10", week: "S3", priority: "P2", dev: "M2 · Tresor", title: "Notation Prestataire" },
  "/client/litige": { id: "11", week: "S3", priority: "P3", dev: "M4 · Kenfack", title: "Signaler Litige" },
  "/client/urgency": { id: "12", week: "S3", priority: "P3", dev: "M9 · Murielle", title: "Mode Urgence" },
  "/client/urgency-contact": { id: "13", week: "S3", priority: "P3", dev: "M9 · Murielle", title: "Contact Urgence" },

  // --- Espace Prestataire ---
  "/provider/dashboard": { id: "14", week: "S2", priority: "P1", dev: "M4 · Kenfack", title: "Dashboard Prestataire" },
  "/provider/profile": { id: "15", week: "S3", priority: "P2", dev: "M8 · Zynelle", title: "Profil Prestataire" },
  "/provider/demandes": { id: "16", week: "S2", priority: "P1", dev: "M3 · Archange", title: "Demandes Disponibles" },
  "/provider/create-quote": { id: "17", week: "S3", priority: "P2", dev: "M3 · Archange", title: "Créer Devis" },
  "/provider/start-mission": { id: "18", week: "S3", priority: "P2", dev: "M4 · Kenfack", title: "Démarrer Mission" },
  "/provider/mission-completed": { id: "19", week: "S3", priority: "P3", dev: "M4 · Kenfack", title: "Tâche Terminée" },
  "/provider/rate-client": { id: "20", week: "S3", priority: "P3", dev: "M8 · Zynelle", title: "Noter Client" },
  "/provider/earnings-history": { id: "21", week: "S3", priority: "P3", dev: "M5 · Patricia", title: "Historique Gains" },

  // --- Espace Administrateur ---
  "/admin/dashboard": { id: "22", week: "S2", priority: "P1", dev: "M1 · Krisan", title: "Dashboard Admin" },
  "/admin/validation": { id: "23", week: "S3", priority: "P2", dev: "M1 · Krisan", title: "Validation Prestataire" },
  "/admin/utilisateurs": { id: "24", week: "S3", priority: "P2", dev: "M6 · Cynthia", title: "Gestion Utilisateurs" },
  "/admin/litiges": { id: "25", week: "S3", priority: "P2", dev: "M6 · Cynthia", title: "Litiges Admin" },
  "/admin/statistics": { id: "26", week: "S4", priority: "P3", dev: "M1 · Krisan", title: "Statistiques Admin" },
  "/admin/commissions": { id: "27", week: "S4", priority: "P3", dev: "M6 · Cynthia", title: "Commissions & Paramètres" },
  "/admin/payments": { id: "28", week: "S4", priority: "P3", dev: "M7 · Marcelle", title: "Paiements Système" },

  // --- Espace Service Client ---
  "/service-client/litige-detail": { id: "29", week: "S2", priority: "P2", dev: "M9 · Murielle", title: "Traitement Litige SC" }
};

export default function PlaceholderPage() {
  const { pathname } = useLocation();

  // Nettoyer le pathname (enlever les slashes de fin s'ils existent)
  const cleanPath = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

  // Récupérer les données de planification associées à la route actuelle
  const pageInfo = PLANNING_DATA[cleanPath];

  // Fallback si la route exacte n'est pas répertoriée dans la matrice
  const segments = cleanPath.split("/").filter(Boolean);
  const fallbackName = segments[segments.length - 1]
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "Page";

  const displayTitle = pageInfo ? pageInfo.title : `${fallbackName} (En construction)`;
  const developer = pageInfo ? pageInfo.dev : "Équipe Frontend";
  const targetWeek = pageInfo ? pageInfo.week : "S2/S3";
  const priority = pageInfo ? pageInfo.priority : "P2";

  // Configuration des couleurs selon l'espace (Rôle)
  const roleColors = {
    client:          { bg: "var(--color-brand-xlight)", border: "var(--color-brand)", text: "var(--color-brand)" },
    provider:        { bg: "var(--color-brand-xlight)", border: "var(--color-brand)", text: "var(--color-brand)" },
    admin:           { bg: "#F1F5F9", border: "#334155", text: "#334155" },
    "service-client": { bg: "#FEF3C7", border: "#D97706", text: "#92400E" }
  };

  const currentRole = segments[0] ?? "client";
  const colors = roleColors[currentRole] ?? roleColors.client;

  // Détermination du badge de priorité (Tailwind v4 ou styles inline)
  const priorityBadgeColor = priority === "P1" ? "#EF4444" : priority === "P2" ? "#F59E0B" : "#10B981";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: "65vh",
        gap: "20px",
        fontFamily: "var(--font-body)",
        padding: "40px",
        textAlign: "center",
      }}
    >
      {/* Indicateur visuel d'attente */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "54px", animation: "pulse 2s infinite" }}>🚧</span>
        {pageInfo?.id && (
          <span 
            style={{
              position: "absolute",
              bottom: "-4px",
              right: "-8px",
              background: "var(--color-sl-900, #1e293b)",
              color: "#fff",
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 6px",
              borderRadius: "6px",
              border: "2px solid #fff"
            }}
          >
            N° {pageInfo.id}
          </span>
        )}
      </div>

      {/* Informations principales de la page maquettée */}
      <div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "22px",
            fontWeight: 700,
            color: "var(--color-sl-900, #0f172a)",
            margin: "0 0 8px",
          }}
        >
          {displayTitle}
        </h2>
        <p style={{ fontSize: "14px", color: "var(--color-sl-500, #64748b)", margin: 0, maxWidth: "450px", lineHeight: "1.5" }}>
          Cette interface est actuellement planifiée dans la feuille de route globale de **ServiLoc**.
        </p>
      </div>

      {/* Tableau / Panel d'attribution de la tâche */}
      <div
        style={{
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: "12px",
          padding: "16px 24px",
          minWidth: "320px",
          textAlign: "left",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Développeur assigné :</span>
          <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: 600 }}>{developer}</span>
        </div>
        
        <div style={{ width: "100%", height: "1px", background: "#E2E8F0", marginBottom: "10px" }} />
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Livraison cible :</span>
          <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: 600 }}>Semaine {targetWeek.replace('S', '')}</span>
        </div>

        <div style={{ width: "100%", height: "1px", background: "#E2E8F0", marginBottom: "10px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 500 }}>Priorité d'intégration :</span>
          <span style={{ fontSize: "11px", color: "#fff", fontWeight: 700, background: priorityBadgeColor, padding: "2px 8px", borderRadius: "4px" }}>
            {priority}
          </span>
        </div>
      </div>

      {/* Tags de routage technique basés sur l'ancien modèle */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
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
          }}
        >
          {cleanPath}
        </span>
        <Badge label={targetWeek} variant={targetWeek.includes("2") ? "warning" : "danger"} />
      </div>
    </div>
  );
}
