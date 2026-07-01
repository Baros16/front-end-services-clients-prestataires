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
