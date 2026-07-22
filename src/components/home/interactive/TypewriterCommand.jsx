// src/components/home/interactive/TypewriterCommand.jsx
import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlass } from '../../commons/IconsPhosphor';
import { EXAMPLE_QUERIES } from '../homeContent';

export const TypewriterCommand = memo(function TypewriterCommand() {
  const [queryIndex, setQueryIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState('typing');

  useEffect(() => {
    const current = EXAMPLE_QUERIES[queryIndex];
    let timeout;

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 45);
      } else {
        timeout = setTimeout(() => setPhase('processing'), 600);
      }
    } else if (phase === 'processing') {
      timeout = setTimeout(() => setPhase('deleting'), 900);
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 20);
      } else {
        setQueryIndex((i) => (i + 1) % EXAMPLE_QUERIES.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, queryIndex]);

  return (
    <div className="rounded-xl border border-sl-200 bg-surface p-5">
      <p className="font-body text-[11px] font-semibold uppercase tracking-wide text-sl-400">
        Décrire une demande
      </p>
      <div className="mt-3 flex items-center gap-2">
        <MagnifyingGlass size={16} className="shrink-0 text-sl-400" />
        <span className="font-body text-sm text-sl-800">
          {displayed}
          <span className="motion-reduce:hidden">|</span>
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-sl-100">
        {phase === 'processing' && (
          <motion.div
            className="h-full w-1/3 rounded-full bg-brand"
            animate={{ x: ['-100%', '300%'] }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          />
        )}
      </div>
    </div>
  );
});