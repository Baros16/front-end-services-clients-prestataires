// src/components/home/Categories.jsx
import { SpotlightCard } from './interactive/SpotLithgCard.jsx';
import { CATEGORIES } from './homeContent';

export function Categories() {
  return (
    <section id="categories" className="bg-sl-50 py-20">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="max-w-xl">
          <span className="font-body text-xs font-semibold uppercase tracking-wide text-brand">Catégories de services</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-sl-900 md:text-4xl">
            Un artisan pour chaque besoin
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_1fr]">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <SpotlightCard
                key={cat.id}
                as="a"
                href={`/client/nouvelle-demande?categorie=${cat.id}`}
                className="flex flex-col items-center gap-3 rounded-xl border border-sl-200 bg-surface px-4 py-7 text-center transition-transform hover:-translate-y-0.5"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-lg ${cat.bg} ${cat.text}`}>
                  <Icon size={24} />
                </span>
                <span className="font-body text-sm font-medium text-sl-800">{cat.label}</span>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}