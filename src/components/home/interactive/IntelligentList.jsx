// src/components/home/interactive/IntelligentList.jsx
import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { INITIAL_DEMANDS } from '../homeContent';

export const IntelligentList = memo(function IntelligentList() {
  const [items, setItems] = useState(INITIAL_DEMANDS);

  useEffect(() => {
    const id = setInterval(() => {
      setItems((prev) => {
        const next = [...prev];
        next.push(next.shift());
        return next;
      });
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <motion.li
          key={item.id}
          layout
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="flex items-center justify-between rounded-lg border border-sl-100 bg-sl-50 px-3 py-2.5"
        >
          <span className="font-body text-xs text-sl-700">{item.label}</span>
          <span
            className={`rounded-full px-2 py-0.5 font-body text-[10px] font-semibold ${
              item.priority === 'Urgent' ? 'bg-danger-light text-danger' : 'bg-sl-100 text-sl-500'
            }`}
          >
            {item.priority}
          </span>
        </motion.li>
      ))}
    </ul>
  );
});