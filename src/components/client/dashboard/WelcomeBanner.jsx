// src/components/client/dashboard/WelcomeBanner.jsx

import { useNavigate } from "react-router-dom";
import { MapPin, Zap } from "../../../components/commons/Icons.jsx";

export default function WelcomeBanner({ profile, location }) {

const navigate = useNavigate();

return (
<div
style={{
background: "var(--color-sl-900)",
borderRadius: "var(--radius-lg)",
boxShadow: "var(--shadow-md)",
}}
className="text-white p-4 md:p-6 flex flex-col md:flex-row md:justify-between
md:items-center mt-4 gap-4 sl-animate-fade-in"
>
<div>
<p
style={{ fontFamily: "var(--font-body)", color: "var(--color-sl-400)" }}
className="text-sm mb-1"
>
Bonjour,  {profile?.firstName}
</p>
<h2
style={{ fontFamily: "var(--font-display)" }}
className="text-xl md:text-2xl font-bold tracking-tight"
>
Besoin d'un service rapidement ?
</h2>
<button
onClick={() => navigate("/client/nouvelle-demande")}
style={{
background: "var(--color-accent)",
borderRadius: "var(--radius-md)",
fontFamily: "var(--font-body)",
}}
className="mt-4 text-black text-sm font-semibold px-4 py-2 inline-flex items-center
gap-2 hover:opacity-90 active:scale-95 transition-all"
>
<Zap size={14} />
Trouver un prestataire maintenant →
</button>
</div><div className="md:text-right flex flex-col gap-1">
<p
style={{ fontFamily: "var(--font-body)", color: "var(--color-sl-400)" }}
className="text-xs"
>
Votre position détectée
</p>
<p
style={{ fontFamily: "var(--font-body)" }}
className="text-sm font-medium text-white flex items-center md:justify-end gap-1"
>
<MapPin size={14} style={{ color: "var(--color-accent)" }} />
{location?.address || "Bafoussam, Cameroun"}
</p>
</div>
</div>
);
}