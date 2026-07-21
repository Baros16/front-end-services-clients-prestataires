// src/components/client/dashboard/CategoryGrid.jsx

import { ServiceCategoryCard } from "../../commons/index.js";
import { Wrench, Zap, Brush, Key, Sparkles, Plus } from "../../commons/Icons.jsx";

const CATEGORIES = [
{ id: "cat_plomberie", label: "Plomberie", icon: <Wrench size={22} />, color:
"var(--color-cat-plomberie)" },
{ id: "cat_electricite", label: "Électricité", icon: <Zap size={22} />, color:
"var(--color-cat-electricite)" },
{ id: "cat_menage", label: "Ménage", icon: <Brush size={22} />, color:
"var(--color-cat-nettoyage)" },
{ id: "cat_serrurerie", label: "Serrurerie", icon: <Key size={22} />, color:
"var(--color-cat-serrurerie)" },
{ id: "cat_peinture", label: "Peinture", icon: <Sparkles size={22} />, color:
"var(--color-cat-peinture)" },
{ id: "cat_autre", label: "Autre", icon: <Plus size={22} />, color:
"var(--color-cat-autre)" },
];
export default function CategoryGrid({ onSelect }) {
return (
<div className="mt-6">
<p
style={{ fontFamily: "var(--font-body)", color: "var(--color-sl-500)" }}
className="text-xs font-semibold uppercase tracking-wide mb-5"
>
Catégories de services
</p>
<div
style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "12px" }}
>
{CATEGORIES.map((cat) => (
<ServiceCategoryCard
key={cat.id}
category={cat}
onClick={() => onSelect?.(cat)}
size="md"
/>
))}
</div>
</div>
);
}