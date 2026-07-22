// src/components/home/ProviderCTA.jsx
import { ArrowRight } from '../commons/IconsPhosphor';
import { MagneticButton } from './interactive/MagneticButton';

export function ProviderCTA() {
  return (
    <section id="prestataires" className="mx-auto max-w-[1400px] px-6 py-20">
      <div className="grid items-center gap-10 rounded-2xl bg-brand px-8 py-12 text-white sm:px-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            Vous êtes plombier, électricien ou artisan&nbsp;?
          </h2>
          <p className="mt-4 max-w-[50ch] font-body text-base leading-relaxed text-brand-xlight">
            Recevez des demandes qualifiées près de chez vous et soyez payé en toute sécurité après
            chaque mission validée.
          </p>
          <MagneticButton
            href="/auth/register"
            className="mt-7 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3.5 font-body text-sm font-semibold text-brand shadow-md"
          >
            Devenir prestataire
            <ArrowRight size={16} />
          </MagneticButton>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { value: '0%', label: 'Frais pour rejoindre' },
            { value: '48h', label: 'Délai de validation' },
            { value: 'J+1', label: 'Libération des gains' },
            { value: '6 villes', label: "Zones d'intervention" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-white/10 p-4">
              <p className="font-display text-xl font-bold">{item.value}</p>
              <p className="mt-1 font-body text-xs leading-snug text-brand-xlight">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}