// src/components/provider/devis/MaterialsSection.jsx
import { Card } from '../../commons/Card';
import { Button } from '../../commons/Button';
import { Plus, X } from '../../commons/Icons';
import { formatXAF } from './formatXAF';

let localId = 0;
const nextLocalId = () => `mat_local_${Date.now()}_${localId++}`;

export function createEmptyMaterial() {
  return { id: nextLocalId(), designation: '', quantity: 1, unitPrice: 0 };
}

/**
 * SectionCard · Matériaux
 * Contient QuoteMaterialsTable — une ligne par matériau, avec ajout/suppression
 * et sous-total calculé en direct (designation × quantité × prix unitaire).
 *
 * Props
 * - materials: [{ id, designation, quantity, unitPrice }]
 * - onChange(nextMaterials)
 */
export function MaterialsSection({ materials, onChange }) {
  const updateRow = (id, patch) => {
    onChange(materials.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const removeRow = (id) => {
    onChange(materials.filter((m) => m.id !== id));
  };

  const addRow = () => {
    onChange([...materials, createEmptyMaterial()]);
  };

  const materialsTotal = materials.reduce(
    (sum, m) => sum + (Number(m.quantity) || 0) * (Number(m.unitPrice) || 0),
    0
  );

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="font-display text-sm font-semibold tracking-wide text-sl-500 uppercase">
          Matériaux nécessaires
        </h2>
        <Button variant="ghost" size="sm" onClick={addRow} className="shrink-0">
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">Ajouter une ligne</span>
          <span className="xs:hidden">Ajouter</span>
        </Button>
      </div>

      {materials.length === 0 ? (
        <p className="text-sm text-sl-400 py-6 text-center border border-dashed border-sl-200 rounded-md">
          Aucun matériau ajouté. Cliquez sur « Ajouter une ligne » si nécessaire.
        </p>
      ) : (
        <>
          {/* ── Desktop / tablet : tableau ── */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold tracking-wide text-sl-500 uppercase border-b border-sl-200">
                  <th className="py-2 pr-3 font-semibold">Désignation</th>
                  <th className="py-2 px-3 font-semibold w-24">Quantité</th>
                  <th className="py-2 px-3 font-semibold w-36">Prix unitaire (XAF)</th>
                  <th className="py-2 pl-3 font-semibold text-right w-28">Sous-total</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-sl-100">
                {materials.map((m) => {
                  const subtotal = (Number(m.quantity) || 0) * (Number(m.unitPrice) || 0);
                  return (
                    <tr key={m.id} className="align-middle">
                      <td className="py-2.5 pr-3">
                        <input
                          type="text"
                          value={m.designation}
                          onChange={(e) => updateRow(m.id, { designation: e.target.value })}
                          placeholder="Ex : Joint silicone cuisine"
                          className="w-full rounded-md border border-sl-200 bg-surface px-2.5 py-1.5 text-sm
                            focus:outline-none focus:ring-2 focus:ring-brand-light/40 focus:border-brand-light"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="number"
                          min={1}
                          value={m.quantity}
                          onChange={(e) => updateRow(m.id, { quantity: Number(e.target.value) })}
                          className="w-full rounded-md border border-sl-200 bg-surface px-2.5 py-1.5 text-sm
                            focus:outline-none focus:ring-2 focus:ring-brand-light/40 focus:border-brand-light"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={m.unitPrice === 0 ? '' : m.unitPrice}
                          onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/[^0-9]/g, '');
                            updateRow(m.id, { unitPrice: digitsOnly === '' ? 0 : Number(digitsOnly) });
                          }}
                          placeholder="0"
                          className="w-full rounded-md border border-sl-200 bg-surface px-2.5 py-1.5 text-sm
                            focus:outline-none focus:ring-2 focus:ring-brand-light/40 focus:border-brand-light"
                        />
                      </td>
                      <td className="py-2.5 pl-3 text-right font-semibold text-sl-900 whitespace-nowrap">
                        {formatXAF(subtotal)}
                      </td>
                      <td className="py-2.5 pl-2 text-right">
                        <button
                          type="button"
                          onClick={() => removeRow(m.id)}
                          aria-label="Supprimer cette ligne"
                          className="p-1.5 rounded-md text-sl-400 hover:text-danger hover:bg-danger-light transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Mobile : cartes empilées ── */}
          <div className="sm:hidden flex flex-col gap-3">
            {materials.map((m) => {
              const subtotal = (Number(m.quantity) || 0) * (Number(m.unitPrice) || 0);
              return (
                <div
                  key={m.id}
                  className="rounded-md border border-sl-200 bg-sl-50/60 p-3 flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <input
                      type="text"
                      value={m.designation}
                      onChange={(e) => updateRow(m.id, { designation: e.target.value })}
                      placeholder="Désignation du matériau"
                      className="flex-1 rounded-md border border-sl-200 bg-surface px-2.5 py-1.5 text-sm
                        focus:outline-none focus:ring-2 focus:ring-brand-light/40 focus:border-brand-light"
                    />
                    <button
                      type="button"
                      onClick={() => removeRow(m.id)}
                      aria-label="Supprimer cette ligne"
                      className="p-1.5 rounded-md text-sl-400 hover:text-danger hover:bg-danger-light transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <label className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-sl-500 uppercase">Qté</span>
                      <input
                        type="number"
                        min={1}
                        value={m.quantity}
                        onChange={(e) => updateRow(m.id, { quantity: Number(e.target.value) })}
                        className="rounded-md border border-sl-200 bg-surface px-2.5 py-1.5 text-sm
                          focus:outline-none focus:ring-2 focus:ring-brand-light/40 focus:border-brand-light"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-[11px] font-semibold text-sl-500 uppercase">P.U (XAF)</span>
                      <input
                        type="number"
                        min={0}
                        step={100}
                        value={m.unitPrice}
                        onChange={(e) => updateRow(m.id, { unitPrice: Number(e.target.value) })}
                        className="rounded-md border border-sl-200 bg-surface px-2.5 py-1.5 text-sm
                          focus:outline-none focus:ring-2 focus:ring-brand-light/40 focus:border-brand-light"
                      />
                    </label>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-sl-200">
                    <span className="text-xs text-sl-500">Sous-total</span>
                    <span className="text-sm font-semibold text-sl-900">{formatXAF(subtotal)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="mt-4 pt-3 border-t border-sl-100 flex justify-between items-center">
        <span className="text-sm text-sl-500">Total matériaux</span>
        <span className="font-display font-semibold text-sl-900">{formatXAF(materialsTotal)}</span>
      </div>
    </Card>
  );
}