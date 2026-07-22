// src/components/home/HowItWorks.jsx
import { motion } from 'framer-motion';
import { STEPS } from './homeContent';

export function HowItWorks() {
  return (
    <section id="fonctionnement" className="mx-auto max-w-[1400px] px-6 py-20">
      <div className="max-w-xl">
        <span className="font-body text-xs font-semibold uppercase tracking-wide text-brand">Comment ça marche</span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-sl-900 md:text-4xl">
          De la demande au paiement, en trois étapes
        </h2>
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((step) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          >
            <span className="font-display text-5xl font-extrabold text-sl-200">{step.number}</span>
            <h3 className="mt-3 font-display text-xl font-bold text-sl-900">{step.title}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-sl-600">{step.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}