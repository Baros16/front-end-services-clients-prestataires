// src/components/provider/quote/MainDoeuvreSection.jsx
import { useState } from 'react';
import { Card, Input } from '../../commons';


export function MainDoeuvreSection({
  laborDescription,
  laborAmount,
  onDescriptionChange,
  onAmountChange,
  errors = {},
}) {
  const [amountHint, setAmountHint] = useState('');

  const handleAmountChange = (value) => {
    const raw = String(value);
    const digitsOnly = raw.replace(/[^0-9]/g, '');

    // Si l'utilisateur a tapé un caractère non numérique, on l'informe
    if (raw !== digitsOnly && raw !== '') {
      setAmountHint('Veuillez entrer uniquement des chiffres.');
    } else {
      setAmountHint('');
    }

    onAmountChange(digitsOnly === '' ? 0 : Number(digitsOnly));
  };

  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-display text-sm font-semibold tracking-wide text-sl-500 uppercase mb-4">
        Main d&rsquo;œuvre
      </h2>
      <div className="flex flex-col gap-5">
        {/* FormField-Description */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="laborDescription"
            className="text-xs font-semibold tracking-wide text-sl-600 uppercase"
          >
            Description des travaux <span className="text-danger">*</span>
          </label>
          <textarea
            id="laborDescription"
            rows={2}
            value={laborDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Ex : Remplacement joint + siphon évier cuisine"
            className={`w-full resize-none rounded-md border bg-surface px-3.5 py-2.5 text-sm text-sl-900
              placeholder:text-sl-400 shadow-card transition-colors
              focus:outline-none focus:ring-2 focus:ring-brand-light/40 focus:border-brand-light
              ${errors.laborDescription ? 'border-danger' : 'border-sl-200'}`}
          />
          {errors.laborDescription && (
            <p className="text-xs text-danger">{errors.laborDescription}</p>
          )}
        </div>
        {/* FormField-Montant */}
        <div className="flex flex-col gap-2 sm:max-w-xs">
          <label
            htmlFor="laborAmount"
            className="text-xs font-semibold tracking-wide text-sl-600 uppercase"
          >
            Montant main d&rsquo;œuvre (XAF) <span className="text-danger">*</span>
          </label>
          <Input
            id="laborAmount"
            type="text"
            inputMode="numeric"
            value={laborAmount === 0 ? '' : String(laborAmount)}
            onChange={handleAmountChange}
            placeholder="15 000"
            error={errors.laborAmount}
          />
          {amountHint && !errors.laborAmount && (
            <p className="text-xs text-warning">{amountHint}</p>
          )}
        </div>
      </div>
    </Card>
  );
}