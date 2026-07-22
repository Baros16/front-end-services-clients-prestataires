// src/components/home/SecurityEscrow.jsx
import { ShieldCheck, Check, Wallet } from '../commons/IconsPhosphor';
import { FocusModeCard } from './interactive/FocusModeCard';

export function SecurityEscrow() {
  return (
    <section id="securite" className="bg-sl-50 py-20">
      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-6 lg:grid-cols-2">
        <div>
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-info-light text-info">
            <ShieldCheck size={24} />
          </span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-sl-900 md:text-4xl">
            Votre argent reste protégé jusqu'à la fin de la mission
          </h2>
          <p className="mt-4 max-w-[55ch] font-body text-base leading-relaxed text-sl-600">
            Dès que vous acceptez un devis, votre paiement Mobile Money est séquestré sur ServiLoc.
            Le prestataire n'est payé qu'après votre validation.
          </p>

          <ul className="mt-6 space-y-3">
            {[
              'Compatible Orange Money et MTN Mobile Money',
              'Fonds libérés après double validation',
              'Service client disponible en cas de litige',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-light text-success">
                  <Check size={13} />
                </span>
                <span className="font-body text-sm text-sl-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-sl-200 bg-surface p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] sm:p-8">
          <div className="flex items-center gap-2 rounded-lg bg-info-light px-4 py-3">
            <Wallet size={16} className="shrink-0 text-info" />
            <p className="font-body text-xs leading-snug text-info">
              Libéré automatiquement dès que vous confirmez la fin des travaux.
            </p>
          </div>
          <div className="mt-5"><FocusModeCard /></div>
        </div>
      </div>
    </section>
  );
}