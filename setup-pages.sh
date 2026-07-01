#!/bin/bash
# setup-pages.sh
# À exécuter UNE SEULE FOIS depuis la racine du projet :
#   bash setup-pages.sh

set -e

echo "→ Création de la structure des pages..."

mkdir -p src/pages/auth
mkdir -p src/pages/client
mkdir -p src/pages/provider
mkdir -p src/pages/admin
mkdir -p src/pages/showcase

# ─── Template placeholder ────────────────────────────────────────────────────
# Chaque page exporte directement une fonction — pas de re-export.
# Vite lazy() nécessite un export default direct dans le fichier cible.

write_placeholder() {
  local FILE=$1
  local NAME=$2
  local OWNER=$3
  local WEEK=$4
  cat > "$FILE" << JSEOF
// ${FILE}
// TODO ${WEEK} — ${OWNER}
import { useLocation } from "react-router-dom";

export default function ${NAME}() {
  const { pathname } = useLocation();
  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", height:"100%", minHeight:"60vh",
      gap:"12px", fontFamily:"sans-serif", color:"#475569", textAlign:"center",
      padding:"40px"
    }}>
      <span style={{ fontSize:"40px" }}>🚧</span>
      <strong style={{ fontSize:"16px", color:"#1E293B" }}>${NAME}</strong>
      <code style={{
        background:"#F1F5F9", padding:"4px 12px",
        borderRadius:"6px", fontSize:"13px"
      }}>{pathname}</code>
      <span style={{ fontSize:"12px" }}>Sera implémentée en ${WEEK}</span>
    </div>
  );
}
JSEOF
  echo "  ✓ $FILE"
}

# ─── Auth ────────────────────────────────────────────────────────────────────
write_placeholder "src/pages/auth/LoginPage.jsx"          "LoginPage"          "M2 + M5" "Semaine 2"
write_placeholder "src/pages/auth/AdminLoginPage.jsx"     "AdminLoginPage"     "M5"      "Semaine 2"
write_placeholder "src/pages/auth/OtpPage.jsx"            "OtpPage"            "M2"      "Semaine 2"

# ─── Client ──────────────────────────────────────────────────────────────────
write_placeholder "src/pages/client/ClientDashboard.jsx"      "ClientDashboard"      "M6" "Semaine 2"
write_placeholder "src/pages/client/NouvelleDemande.jsx"      "NouvelleDemande"      "M3" "Semaine 2"
write_placeholder "src/pages/client/SuiviMission.jsx"         "SuiviMission"         "M5" "Semaine 3"
write_placeholder "src/pages/client/NotationPrestataire.jsx"  "NotationPrestataire"  "M2" "Semaine 3"

# ─── Provider ────────────────────────────────────────────────────────────────
write_placeholder "src/pages/provider/ProviderDashboard.jsx"   "ProviderDashboard"   "M4" "Semaine 2"
write_placeholder "src/pages/provider/DemandesDisponibles.jsx" "DemandesDisponibles" "M3" "Semaine 2"
write_placeholder "src/pages/provider/CreerDevis.jsx"          "CreerDevis"          "M3" "Semaine 3"
write_placeholder "src/pages/provider/DemarrerMission.jsx"     "DemarrerMission"     "M4" "Semaine 3"
write_placeholder "src/pages/provider/SignalerLitige.jsx"      "SignalerLitige"      "M4" "Semaine 3"

# ─── Admin ───────────────────────────────────────────────────────────────────
write_placeholder "src/pages/admin/AdminDashboard.jsx"          "AdminDashboard"          "M1" "Semaine 2"
write_placeholder "src/pages/admin/ValidationPrestataire.jsx"   "ValidationPrestataire"   "M1" "Semaine 3"
write_placeholder "src/pages/admin/GestionUtilisateurs.jsx"     "GestionUtilisateurs"     "M6" "Semaine 3"
write_placeholder "src/pages/admin/LitigesAdmin.jsx"            "LitigesAdmin"            "M6" "Semaine 3"

# ─── Showcase ────────────────────────────────────────────────────────────────
write_placeholder "src/pages/showcase/ShowcasePage.jsx" "ShowcasePage" "M6" "Semaine 1 J4-J5"

# ─── 404 ─────────────────────────────────────────────────────────────────────
cat > src/pages/NotFoundPage.jsx << 'JSEOF'
// src/pages/NotFoundPage.jsx
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  function goHome() {
    try {
      const raw = localStorage.getItem("sl_mock_user");
      if (!raw) { navigate("/auth/login"); return; }
      const { role } = JSON.parse(raw);
      if (role === "CLIENT")        navigate("/client/dashboard");
      else if (role === "PROVIDER") navigate("/provider/dashboard");
      else                          navigate("/admin/dashboard");
    } catch {
      navigate("/auth/login");
    }
  }

  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", height:"100vh", gap:"14px",
      fontFamily:"sans-serif", color:"#475569"
    }}>
      <span style={{ fontSize:"48px" }}>🗺️</span>
      <strong style={{ fontSize:"18px", color:"#1E293B" }}>Page introuvable</strong>
      <code style={{ background:"#F1F5F9", padding:"4px 12px", borderRadius:"6px", fontSize:"13px" }}>
        {window.location.pathname}
      </code>
      <button
        onClick={goHome}
        style={{
          padding:"10px 22px", background:"#1B4332", color:"#fff",
          border:"none", borderRadius:"10px", cursor:"pointer",
          fontSize:"14px", fontWeight:600
        }}
      >
        Retour à l'accueil
      </button>
    </div>
  );
}
JSEOF
echo "  ✓ src/pages/NotFoundPage.jsx"

echo ""
echo "✅ Structure complète créée. Lance : npm run dev"
echo ""
echo "Pour tester la navigation, colle dans la console du navigateur :"
echo "  __sl.setMockUser('CLIENT')"
echo "  __sl.setMockUser('PROVIDER')"
echo "  __sl.setMockUser('ADMIN')"
