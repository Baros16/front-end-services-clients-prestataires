// src/components/home/interactive/SpotlightCard.jsx
import { memo } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';

export const SpotlightCard = memo(function SpotlightCard({ children, className, as: Tag = 'div', href }) {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const background = useMotionTemplate`radial-gradient(220px circle at ${mx}px ${my}px, rgba(45,106,79,0.14), transparent 70%)`;

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  }
  function handleLeave() {
    mx.set(-200);
    my.set(-200);
  }

  const Comp = motion[Tag] ?? motion.div;

  return (
    <Comp
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative overflow-hidden ${className}`}
    >
      <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background }} />
      <span className="relative">{children}</span>
    </Comp>
  );
});