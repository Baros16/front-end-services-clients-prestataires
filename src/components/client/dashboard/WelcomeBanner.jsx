// src/components/client/dashboard/WelcomeBanner.jsx

import { useNavigate } from "react-router-dom";
import { MapPin, Zap } from "../../../components/commons/Icons.jsx";
import { Button } from "../../commons/Button.jsx";

export default function WelcomeBanner({ profile}) {

const navigate = useNavigate();
const location = profile?.location;

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
<Button
 variant="ghost"
 className="mt-2 bg-white text-black font-bold px-4 py-2 rounded-lg hover:bg-white/90 transition-all w-fit"
 onClick={() => navigate("/client/nouvelle-demande")}
>
    <Zap size={14} />
Trouver un prestataire maintenant →
</Button>
</div><div className="md:text-right flex flex-col gap-1">
<p
style={{ fontFamily: "var(--font-body)", color: "var(--color-sl-400)" }}
className="text-xs"
>
{location?.city &&  "Votre position détectée"}
</p>
<p
style={{ fontFamily: "var(--font-body)" }}
className="text-sm font-medium text-white flex items-center md:justify-end gap-1"
>
<MapPin size={14} style={{ color: "var(--color-accent)" }} />
{location?.district && location?.city ? 
location.district + "," + location.city : location?.district || location?.city || "Dschang, Cameroun"}
</p>
</div>
</div>
);
}
