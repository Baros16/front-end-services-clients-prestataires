import { useState } from 'react';

import { formatXAF } from '../../../utils/formatters';
import { AmountDisplay } from '../../commons';

const HEADERS = ['Désignation', 'Qté', 'Prix unit.', 'Sous-total'];
const COLLAPSED_COUNT = 5;

export default function QuoteTable({ laborDescription, laborAmount, materials, totalAmount }) {
  const [expanded, setExpanded] = useState(false);

  const rows = [
    { id: 'labor', designation: laborDescription, quantity: 1, unitPrice: laborAmount, subtotal: laborAmount },
    ...materials,
  ];

  const hasMore = rows.length > COLLAPSED_COUNT;
  const visibleRows = expanded ? rows : rows.slice(0, COLLAPSED_COUNT);
  const hiddenCount = rows.length - COLLAPSED_COUNT;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm font-body min-w-[420px]">
        <thead>
          <tr className="border-b border-[var(--color-sl-200)]">
            {HEADERS.map((h, i) => (
              <th
                key={h}
                className={[
                  'py-3 text-[10px] font-semibold tracking-[0.14em] uppercase text-[var(--color-sl-400)]',
                  i === 0 ? 'text-left pl-6' : i === 3 ? 'text-right pr-6' : 'text-center px-4',
                ].join(' ')}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {visibleRows.map((row, i) => (
            <tr
              key={row.id}
              className="border-b border-[var(--color-sl-100)] sl-animate-fade-in"
              style={{ animationDelay: `${i * 65}ms`, animationFillMode: 'both' }}
            >
              <td className="py-4 pl-6 pr-4 text-[var(--color-sl-700)] font-medium leading-snug">
                {row.designation}
              </td>
              <td className="py-4 px-4 text-center text-[var(--color-sl-500)]">{row.quantity}</td>
              <td className="py-4 px-4 text-right text-[var(--color-sl-500)] whitespace-nowrap">
                {formatXAF(row.unitPrice)}
              </td>
              <td className="py-4 pr-6 text-right font-semibold text-[var(--color-sl-800)] whitespace-nowrap">
                {formatXAF(row.subtotal)}
              </td>
            </tr>
          ))}

          {hasMore && (
            <tr>
              <td colSpan={4} className="py-2 px-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded((v) => !v)}
                  className="w-full justify-center"
                >
                  {expanded ? 'Réduire' : `Voir les ${hiddenCount} ligne${hiddenCount > 1 ? 's' : ''} restante${hiddenCount > 1 ? 's' : ''}`}
                </Button>
              </td>
            </tr>
          )}
        </tbody>

        <tfoot>
          <tr className="bg-[var(--color-sl-50)]">
            <td
              colSpan={3}
              className="py-5 pl-6 pr-4 text-right text-[10px] font-bold tracking-[0.18em] uppercase text-[var(--color-sl-400)]"
            >
              Total
            </td>
            <td className="py-5 pr-6 text-right">
              <AmountDisplay amount={totalAmount} size="lg" />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}