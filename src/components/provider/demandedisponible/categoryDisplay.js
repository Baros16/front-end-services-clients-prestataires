// src/components/provider/demandedisponible/categoryDisplay.js
// Source de vérité unique — remplace les CATEGORY_DISPLAY dupliqués/incohérents
// dans DemandCard.jsx et DemandDetailModal.jsx
import { Wrench, Zap, Brush, Key, Sparkles } from '../../commons/Icons';

export const CATEGORY_DISPLAY = {
  wrench:  { Icon: Wrench,   bgVar: 'var(--color-accent-light)' },
  bolt:    { Icon: Zap,      bgVar: 'var(--color-warning-light)' },
  broom:   { Icon: Brush,    bgVar: 'var(--color-success-light)' },
  key:     { Icon: Key,      bgVar: 'var(--color-accent-light)' },
  paint:   { Icon: Sparkles, bgVar: '#F3E8FF' },
  default: { Icon: Wrench,   bgVar: 'var(--color-sl-100)' },
};