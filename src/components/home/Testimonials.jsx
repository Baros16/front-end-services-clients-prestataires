// src/components/home/Testimonials.jsx
import { TiltCard } from './interactive/TiltCard';
import { Star } from '../commons/IconsPhosphor';
import { TESTIMONIALS } from './homeContent';

export function Testimonials() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-20">
      <div className="max-w-xl">
        <span className="font-body text-xs font-semibold uppercase tracking-wide text-brand">Ils utilisent ServiLoc</span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-sl-900 md:text-4xl">
          La confiance, mesurée à chaque mission
        </h2>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <TiltCard
            key={t.name}
            className="flex h-full flex-col rounded-xl border border-sl-200 bg-surface p-6 shadow-card"
          >
            <div className="flex items-center gap-1 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} weight={i < t.rating ? 'fill' : 'regular'} className={i < t.rating ? '' : 'opacity-30'} />
              ))}
            </div>
            <p className="mt-4 flex-1 font-body text-sm leading-relaxed text-sl-700">« {t.quote} »</p>
            <div className="mt-6 flex items-center gap-3 border-t border-sl-100 pt-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-xlight font-body text-sm font-semibold text-brand">
                {t.initial}
              </span>
              <div>
                <p className="font-body text-sm font-semibold text-sl-900">{t.name}</p>
                <p className="font-body text-xs text-sl-500">{t.city}</p>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}