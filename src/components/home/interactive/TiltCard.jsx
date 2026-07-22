// src/components/home/interactive/TiltCard.jsx
import { memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const TiltCard = memo(function TiltCard({ children, className }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springRY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 8);
    rotateX.set(py * -8);
  }
  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: springRX, rotateY: springRY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
});