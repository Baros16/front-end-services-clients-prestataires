// src/components/home/Hero.jsx
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from '../commons/IconsPhosphor';
import { MagneticButton } from './interactive/MagneticButton';
import { LiveStatusCard } from './interactive/LiveStatusCard';

export function Hero() {
  return <>
    <section id="top" className="relative overflow-hidden bg-sl-50">
      <div className="mx-auto grid max-w-[1400px] items-center gap-16 px-6 py-16 md:py-24 lg:grid-cols-[1.3fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-xlight px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide text-brand">
            Services à domicile · Cameroun
          </span>

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tighter text-sl-900 md:text-6xl">
            Trouvez un prestataire de confiance,{' '}
            <span className="text-brand">payez seulement</span> une fois le travail fait.
          </h1>

          <p className="mt-6 max-w-[52ch] font-body text-lg leading-relaxed text-sl-600">
            Décrivez votre besoin, recevez des devis de prestataires vérifiés près de chez vous, et
            libérez le paiement uniquement après validation de la mission.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MagneticButton
              href="/auth/register"
              className="flex items-center justify-center gap-2 rounded-md bg-brand px-6 py-3.5 font-body text-sm font-semibold text-white shadow-md"
            >
              Publier une demande
              <ArrowRight size={16} />
            </MagneticButton>
            
            <a  href="#prestataires"
              className="flex items-center justify-center gap-2 rounded-md border border-sl-300 bg-surface px-6 py-3.5 font-body text-sm font-semibold text-sl-800 transition-colors hover:border-brand hover:text-brand"
            >
              Devenir prestataire
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 90, damping: 18, delay: 0.15 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="absolute -left-4 top-10 w-full -rotate-3 rounded-xl border border-sl-200 bg-surface p-5 opacity-70 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sl-100 font-body text-sm font-semibold text-sl-500">
                ?
              </span>
              <div>
                <p className="font-body text-sm font-medium text-sl-700">Nouvelle demande</p>
                <p className="font-body text-xs text-sl-400">En attente de devis…</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-xl border border-sl-200 bg-surface p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)]">
            <LiveStatusCard />

            <div className="mt-5 flex items-center justify-between rounded-lg bg-sl-50 px-4 py-3">
              <span className="font-body text-xs font-medium uppercase tracking-wide text-sl-500">Devis séquestré</span>
              <span className="font-display text-lg font-bold text-brand">18 500 XAF</span>
            </div>

            <MagneticButton
              href="/auth/register"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-sl-900 py-2.5 font-body text-sm font-semibold text-white"
            >
              Voir le devis
              <ArrowRight size={16} />
            </MagneticButton>
          </div>

          <div className="absolute -bottom-5 -right-4 flex items-center gap-2 rounded-full border border-sl-200 bg-surface px-4 py-2 shadow-card">
            <MapPin size={16} className="text-brand" />
            <span className="font-body text-xs font-medium text-sl-700">Bafoussam, Quartier Banengo</span>
          </div>
        </motion.div>
      </div>
    </section>
  </>
}