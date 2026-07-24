// src/components/client/dashboard/RecentDemandsList.jsx

import { useNavigate } from "react-router-dom";
import { StatusBadge, EmptyState } from "../../commons/index.js"; // ← ajout EmptyState
import { formatDate } from "../../../utils/formatters.js";
import { Wrench, Zap, Brush, Key, Sparkles, Plus } from "../../commons/Icons.jsx";
import { Button } from "../../commons/index.js";

const CATEGORY_ICONS = {
  cat_plomberie: <Wrench size={16} />,
  cat_electricite: <Zap size={16} />,
  cat_menage: <Brush size={16} />,
  cat_serrurerie: <Key size={16} />,
  cat_peinture: <Sparkles size={16} />,
  cat_autre: <Plus size={16} />,
};

export default function RecentDemandsList({ demands }) {
  const navigate = useNavigate();

  const isEmpty = !demands || demands.length === 0; // ← flag

  return (
    <div
      style={{
        background: "white",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-card)",
        border: "1px solid var(--color-sl-200)",
      }}
      className="p-4 w-full"
    >
      <div className="flex justify-between items-center mb-4">
        <p
          style={{ fontFamily: "var(--font-body)", color: "var(--color-sl-700)" }}
          className="text-xs font-semibold uppercase tracking-wide"
        >
          Mes demandes récentes
        </p>
        {/* Bouton masqué si liste vide */}
        {!isEmpty && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate("/client/demandes")}
          >
            Tout voir
          </Button>
        )}
      </div>

      {isEmpty ? (
        <EmptyState
          title="Aucune demande pour l'instant"
          subtitle="Vos demandes de service apparaîtront ici une fois créées."
          action={
            <Button
              variant="secondary"
              size="sm"
              className="!bg-black !text-white !border-black hover:!bg-gray-900"
              onClick={() => navigate("/client/nouvelle-demande")}
            >
              + Nouvelle demande
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col">
          {demands.map((demand) => {
            const icon = CATEGORY_ICONS[demand.category?.id] || <Wrench size={16} />;
            return (
              <div
                key={demand.id}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      background: "var(--color-sl-100)",
                      borderRadius: "var(--radius-sm)",
                      color: "var(--color-sl-600)",
                    }}
                    className="p-2 flex items-center justify-center"
                  >
                    {icon}
                  </div>
                  <div>
                    <p
                      style={{ fontFamily: "var(--font-body)" }}
                      className="text-sm font-semibold text-slate-800"
                    >
                      {demand.category?.label}
                      <span
                        style={{ color: "var(--color-sl-400)" }}
                        className="font-normal"
                      >
                        {" · "}{demand.providerName || "—"}
                      </span>
                    </p>
                    <p
                      style={{ fontFamily: "var(--font-body)", color: "var(--color-sl-400)" }}
                      className="text-xs truncate max-w-[180px]"
                    >
                      {demand.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 ml-2">
                  <StatusBadge variant={demand.status} size="sm" />
                  <span
                    style={{ fontFamily: "var(--font-body)", color: "var(--color-sl-400)" }}
                    className="text-xs"
                  >
                    {formatDate(demand.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}