// src/components/home/interactive/WideDataStream.jsx
import { memo } from 'react';
import { motion } from 'framer-motion';
import { STREAM_ITEMS } from '../homeContent';

export const WideDataStream = memo(function WideDataStream() {
  const loopItems = [...STREAM_ITEMS, ...STREAM_ITEMS];
  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex w-max gap-4"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        {loopItems.map((item, i) => (
          <div
            key={`${item.label}-${i}`}
            className="flex min-w-[160px] flex-col rounded-lg border border-sl-100 bg-sl-50 px-4 py-3"
          >
            <span className="font-body text-[11px] uppercase tracking-wide text-sl-400">{item.label}</span>
            <span className="mt-1 font-display text-lg font-bold text-sl-900">{item.value}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
});