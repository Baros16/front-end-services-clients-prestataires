import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, X, ArrowRight } from '../commons/IconsPhosphor';
import { MagneticButton } from './interactive/MagneticButton';
import { NAV_LINKS } from './homeContent';


export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/40 bg-surface/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand font-display text-base font-bold text-white">S</span>
            <span className="font-display text-lg font-bold tracking-tight text-sl-900">ServiLoc</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-sm font-medium text-sl-600 transition-colors hover:text-brand"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a href="/auth/login" className="rounded-md px-4 py-2 font-body text-sm font-medium text-sl-700 hover:text-brand">
              Se connecter
            </a>
            <MagneticButton
              href="/auth/register"
              className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 font-body text-sm font-semibold text-white shadow-card"
            >
              Commencer
              <ArrowRight size={16} />
            </MagneticButton>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-sl-700 md:hidden"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <List size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-sl-200 bg-surface md:hidden"
            >
              <nav className="flex flex-col gap-4 px-6 py-4">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="font-body text-sm font-medium text-sl-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-2 flex flex-col gap-2 border-t border-sl-200 pt-4">
                  <a href="/auth/login" className="rounded-md py-2 text-center font-body text-sm font-medium text-sl-700">
                    Se connecter
                  </a>
                  <a href="/auth/register" className="rounded-md bg-brand py-2.5 text-center font-body text-sm font-semibold text-white">
                    Commencer
                  </a>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}