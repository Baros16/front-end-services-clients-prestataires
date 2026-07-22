// src/components/home/interactive/LiveStatusCard.jsx
import { memo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LiveStatusCard = memo(function LiveStatusCard() {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setShowBadge(true);
      setTimeout(() => setShowBadge(false), 3000);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex items-center gap-3 rounded-lg border border-sl-100 bg-sl-50 px-4 py-3.5">
      <motion.span
        className="h-2.5 w-2.5 shrink-0 rounded-full bg-success motion-reduce:animate-none"
        animate={{ opacity: [1, 0.4, 1], scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div>
        <p className="font-body text-xs font-semibold text-sl-800">Jules B. — Disponible</p>
        <p className="font-body text-[11px] text-sl-500">Prochain créneau : 14h30</p>
      </div>

      <AnimatePresence>
        {showBadge && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 12 }}
            className="absolute -right-2 -top-2 rounded-full bg-accent px-2 py-0.5 font-body text-[10px] font-bold text-white shadow-md"
          >
            Nouvelle demande
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
});