// src/components/home/BentoFeatures.jsx
import { IntelligentList } from './interactive/IntelligentList';
import { TypewriterCommand } from './interactive/TypewriterCommand';
import { FocusModeCard } from './interactive/FocusModeCard';
import { WideDataStream } from './interactive/WideDataStream';

export function BentoFeatures() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-20">
      <div className="max-w-xl">
        <span className="font-body text-xs font-semibold uppercase tracking-wide text-brand">La plateforme en direct</span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-sl-900 md:text-4xl">
          Ce qui se passe pendant que vous attendez votre devis
        </h2>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-sl-200 bg-surface p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          <p className="font-body text-sm font-semibold text-sl-900">Demandes classées en direct</p>
          <p className="mt-1 font-body text-xs text-sl-500">Les urgences remontent automatiquement en tête de file.</p>
          <div className="mt-4"><IntelligentList /></div>
        </div>

        <div className="rounded-xl border border-sl-200 bg-surface p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          <p className="font-body text-sm font-semibold text-sl-900">Décrivez, on s'occupe du reste</p>
          <p className="mt-1 font-body text-xs text-sl-500">Quelques mots suffisent pour lancer une demande.</p>
          <div className="mt-4"><TypewriterCommand /></div>
        </div>

        <div className="rounded-xl border border-sl-200 bg-surface p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          <p className="font-body text-sm font-semibold text-sl-900">Suivi jusqu'à la validation</p>
          <p className="mt-1 font-body text-xs text-sl-500">Chaque ligne du devis est vérifiable avant paiement.</p>
          <div className="mt-4"><FocusModeCard /></div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-sl-200 bg-surface p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
        <p className="font-body text-sm font-semibold text-sl-900">Missions réalisées cette semaine, par catégorie</p>
        <div className="mt-4"><WideDataStream /></div>
      </div>
    </section>
  );
}