// src/components/home/Footer.jsx
import { Wallet } from '../commons/IconsPhosphor';
import { FOOTER_COLUMNS } from './homeContent';

export function Footer() {
  return (
    <footer className="border-t border-sl-200 bg-surface">
      <div className="mx-auto max-w-[1400px] px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_2fr]">
          <div>
            <a href="#top" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand font-display text-base font-bold text-white">
                S
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-sl-900">ServiLoc</span>
            </a>
            <p className="mt-4 max-w-[32ch] font-body text-sm leading-relaxed text-sl-500">
              La plateforme qui met en relation clients et prestataires de confiance, partout au Cameroun.
            </p>
            <div className="mt-5 flex items-center gap-2 font-body text-xs text-sl-400">
              <Wallet size={16} />
              Paiements via Orange Money & MTN Mobile Money
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="font-body text-sm font-semibold text-sl-900">{col.title}</h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="font-body text-sm text-sl-500 transition-colors hover:text-brand">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-sl-200 pt-6 sm:flex-row">
          <p className="font-body text-xs text-sl-400">© {new Date().getFullYear()} ServiLoc. Tous droits réservés.</p>
          <p className="font-body text-xs text-sl-400">Bafoussam · Douala · Yaoundé et 3 autres villes</p>
        </div>
      </div>
    </footer>
  );
}