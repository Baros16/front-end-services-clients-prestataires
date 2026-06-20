// src/components/admin/dashboard/RecentTransactionsTable.jsx

import { Card, DataTable, StatusBadge, AmountDisplay, Button } from "../../commons";

/**
 * Colonnes définies hors du composant : pas de recréation à chaque render.
 *
 * Colonnes : ID · Client · Prestataire · Service · Montant · Commission (vert) · Statut
 *
 * status attendu : "sequestre" | "libere" | "litige" — StatusVariant valides.
 */
const COLUMNS = [
  {
    key: "id",
    header: "ID",
    render: (r) => (
      <span className="font-mono text-[13px] font-semibold text-sl-700">
        {r.id}
      </span>
    ),
  },
  {
    key: "clientName",
    header: "Client",
  },
  {
    key: "providerName",
    header: "Prestataire",
  },
  {
    key: "service",
    header: "Service",
  },
  {
    key: "amount",
    header: "Montant",
    render: (r) => <AmountDisplay amount={r.amount} />,
  },
  {
    key: "commission",
    header: "Commission",
    render: (r) => <AmountDisplay amount={r.commission} variant="positive" />,
  },
  {
    key: "status",
    header: "Statut",
    render: (r) => <StatusBadge variant={r.status} />,
  },
];

/**
 * RecentTransactionsTable
 *
 * Tableau des dernières transactions de la plateforme.
 * Lien "Tout voir →" en haut à droite.
 *
 * @param {{
 *   transactions: Transaction[],
 *   onViewAll: () => void,
 * }} props
 *
 * @typedef {{
 *   id: string,
 *   clientName: string,
 *   providerName: string,
 *   service: string,
 *   amount: number,
 *   commission: number,
 *   status: string,
 * }} Transaction
 */
export default function RecentTransactionsTable({ transactions, onViewAll }) {
  return (
    <Card
      title="Dernières transactions"
      actions={
        <Button size="sm" variant="ghost" onClick={onViewAll}>
          Tout voir →
        </Button>
      }
      noPadding
    >
      <DataTable
        data={transactions}
        keyExtractor={(r) => r.id}
        columns={COLUMNS}
      />
    </Card>
  );
}
