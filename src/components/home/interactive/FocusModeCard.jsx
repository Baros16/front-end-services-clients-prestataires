// src/components/home/interactive/FocusModeCard.jsx
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Check } from '../../commons/IconsPhosphor';

export const FocusModeCard = memo(function FocusModeCard() {
  const lines = ['Main d’œuvre — 12 000 XAF', 'Matériaux — 6 500 XAF', 'Total séquestré — 18 500 XAF'];
  return (
    <div className="relative rounded-lg border border-sl-100 bg-sl-50 p-4">
      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.6 }}
        variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
        className="space-y-2"
      >
        {lines.map((line) => (
          <motion.li
            key={line}
            variants={{
              hidden: { opacity: 0.35, backgroundColor: 'rgba(216,243,220,0)' },
              visible: { opacity: 1, backgroundColor: 'rgba(216,243,220,0.6)' },
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="rounded-md px-2 py-1.5 font-body text-xs text-sl-700"
          >
            {line}
          </motion.li>
        ))}
      </motion.ul>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 150, damping: 16 }}
        className="mt-3 flex items-center gap-2 rounded-lg bg-sl-900 px-3 py-2"
      >
        <Check size={14} className="text-white" />
        <span className="font-body text-[11px] font-medium text-white">Valider la mission</span>
      </motion.div>
    </div>
  );
});