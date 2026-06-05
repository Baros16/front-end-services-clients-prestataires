// src/pages/client/NouvelleDemande.jsx
// TODO Semaine 2 — M3
import { useLocation } from "react-router-dom";

export default function NouvelleDemande() {
  const { pathname } = useLocation();
  return (
    <div style={{
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", height:"100%", minHeight:"60vh",
      gap:"12px", fontFamily:"sans-serif", color:"#475569", textAlign:"center",
      padding:"40px"
    }}>
      <span style={{ fontSize:"40px" }}>🚧</span>
      <strong style={{ fontSize:"16px", color:"#1E293B" }}>NouvelleDemande</strong>
      <code style={{
        background:"#F1F5F9", padding:"4px 12px",
        borderRadius:"6px", fontSize:"13px"
      }}>{pathname}</code>
      <span style={{ fontSize:"12px" }}>Sera implémentée en Semaine 2</span>
    </div>
  );
}
