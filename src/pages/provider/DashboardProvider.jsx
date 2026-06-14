// =============================================================================
// COURS REACT — Dashboard Prestataire (Semaine 2)
// Membre : M4 Kenfack · ServiLoc Frontend
// =============================================================================
//
// OBJECTIF DE CE FICHIER
// Afficher le tableau de bord du prestataire avec :
//   - ses statistiques du mois (missions, gains)
//   - ses missions actives
//   - l'historique de ses dernières missions terminées
//   - un état vide si aucune donnée
//
// COMMENT FONCTIONNE UNE PAGE REACT ?
// Une page React c'est une FONCTION qui retourne du HTML-like (JSX).
// Quand tu vois <MonComposant /> c'est comme écrire une balise HTML custom.
// React va appeler la fonction du composant et afficher ce qu'elle retourne.
//
// LE CYCLE DE VIE D'UNE PAGE (les 3 étapes)
//   1. La page se charge   → état "loading"  → on affiche un spinner
//   2. Les données arrivent → état "data"     → on affiche le contenu
//   3. Erreur réseau       → état "error"    → on affiche un message
// =============================================================================

// --- LES IMPORTS ---
// "import" sert à utiliser du code écrit dans un autre fichier.
// Les composants viennent du dossier /src/components/ (créés par M1 Krisan).
// Les données mock viennent du fichier JSON qu'on a créé juste avant.

import { useState, useEffect } from "react";
// useState  → garde en mémoire une valeur qui peut changer (ex: les données chargées)
// useEffect → exécute du code APRÈS que la page s'est affichée (ex: charger les données)

// Composants de mise en page (créés par M1)
import AppShell    from "../../components/AppShell";
import PageHeader  from "../../components/PageHeader";

// Composants de données (créés par M1 et M4 en S1)
import StatCard     from "../../components/StatCard";
import StatusBadge  from "../../components/StatusBadge";
import EmptyState   from "../../components/EmptyState";
import SkeletonLoader from "../../components/SkeletonLoader";

// Données mock — ce fichier JSON simule la réponse de l'API.
// En S3, quand le backend livrera GET /provider/dashboard,
// on remplacera cet import par un vrai appel HTTP via axios.
import mockData from "../../data/provider/mock_dashboard.json";

// =============================================================================
// LE COMPOSANT PRINCIPAL
// Convention : le nom du composant = le nom du fichier, en PascalCase.
// "export default" = ce composant est LE composant de ce fichier,
//                    les autres fichiers peuvent l'importer directement.
// =============================================================================
export default function DashboardProvider() {

  // --- LES ÉTATS (useState) ---
  // Un état = une variable qui, quand elle change, fait re-afficher la page.
  // Syntaxe : const [valeur, fonctionPourChanger] = useState(valeurInitiale)

  // "data" contiendra les données du dashboard une fois chargées.
  // Au départ = null (rien chargé encore).
  const [data, setData] = useState(null);

  // "isLoading" indique si on est en train de charger. Commence à true.
  const [isLoading, setIsLoading] = useState(true);

  // "error" contiendra le message d'erreur si le chargement échoue.
  const [error, setError] = useState(null);

  // --- CHARGER LES DONNÉES (useEffect) ---
  // useEffect(fonction, []) = "exécute cette fonction UNE SEULE FOIS,
  //                            après le premier affichage de la page".
  // Le [] vide = "ne re-exécute jamais automatiquement".
  // Sans le [], ça bouclerait à l'infini.

  useEffect(() => {

    // On simule un chargement réseau avec setTimeout (délai artificiel de 800ms)
    // En vrai (S3), ici on fera : const response = await axios.get('/provider/dashboard')
    const timer = setTimeout(() => {
      try {
        // Succès : on met les données dans l'état
        setData(mockData.data);
        setIsLoading(false);
      } catch (err) {
        // Échec : on note l'erreur
        setError("Impossible de charger le tableau de bord.");
        setIsLoading(false);
      }
    }, 800);

    // Nettoyage : si l'utilisateur quitte la page avant les 800ms,
    // on annule le timer pour éviter une mise à jour sur un composant démonté.
    return () => clearTimeout(timer);

  }, []); // [] = une seule exécution

  // =============================================================================
  // RENDU CONDITIONNEL
  // On affiche une chose différente selon l'état de la page.
  // Le "return" en React = ce qu'on affiche à l'écran.
  // =============================================================================

  // --- ÉTAT 1 : CHARGEMENT ---
  // Si isLoading est true, on affiche des "squelettes" (placeholders gris animés)
  // au lieu de contenu vide. C'est plus professionnel que juste "Chargement...".
  if (isLoading) {
    return (
      <AppShell role="provider">
        <PageHeader title="Tableau de bord" subtitle="Chargement..." />
        {/* SkeletonLoader = les rectangles gris animés qui imitent la forme du contenu */}
        <div className="p-6 space-y-4">
          <SkeletonLoader rows={4} />
        </div>
      </AppShell>
    );
  }

  // --- ÉTAT 2 : ERREUR ---
  // Si error n'est pas null, on affiche le message d'erreur.
  if (error) {
    return (
      <AppShell role="provider">
        <PageHeader title="Tableau de bord" />
        <div className="p-6">
          {/* EmptyState = composant vide standard avec icône et message */}
          <EmptyState
            icon="alert"
            title="Une erreur est survenue"
            description={error}
            actionLabel="Réessayer"
            onAction={() => window.location.reload()}
          />
        </div>
      </AppShell>
    );
  }

  // --- ÉTAT 3 : DONNÉES CHARGÉES ---
  // On extrait les sous-objets du data pour les utiliser plus facilement.
  // C'est de la "déstructuration" JavaScript : au lieu d'écrire data.provider,
  // data.stats etc., on sort les propriétés en variables directes.
  const { provider, stats, activeMissions, recentMissions } = data;

  // On formate le montant en XAF (Franc CFA).
  // toLocaleString('fr-CM') = formatage français camerounais (ex: 185 000)
  const formatXAF = (amount) =>
    `${amount.toLocaleString("fr-CM")} XAF`;

  // =============================================================================
  // LE JSX — ce que la page affiche réellement
  //
  // JSX = JavaScript + XML. C'est une façon d'écrire du HTML dans JavaScript.
  // Règles importantes :
  //   - Tout le JSX doit être dans UN seul élément parent (ici <AppShell>)
  //   - Les classes CSS s'écrivent className= (pas class= comme en HTML)
  //   - Les accolades {} permettent d'injecter du JavaScript dans le HTML
  //   - Les commentaires dans JSX s'écrivent {/* comme ça */}
  // =============================================================================

  return (
    // AppShell = la mise en page globale avec la Sidebar prestataire à gauche
    // et le contenu principal à droite. role="provider" = thème prestataire (couleurs, sidebar).
    <AppShell role="provider">

      {/* PageHeader = barre de titre en haut du contenu */}
      <PageHeader
        title={`Bonjour, ${provider.firstName} 👋`}
        subtitle="Voici votre activité du mois en cours"
      />

      {/* Conteneur principal — padding et espacement vertical */}
      <div className="p-6 space-y-8">

        {/* ================================================================
            SECTION 1 — STATISTIQUES (les 4 grandes cartes de KPI)
            KPI = Key Performance Indicator = chiffre important
        ================================================================ */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Ce mois-ci
          </h2>

          {/*
            GRILLE CSS avec Tailwind :
            grid                = affichage en grille
            grid-cols-1         = 1 colonne sur mobile (petit écran)
            sm:grid-cols-2      = 2 colonnes sur écran moyen (≥640px)
            lg:grid-cols-4      = 4 colonnes sur grand écran (≥1024px)
            gap-4               = espace de 16px entre les cartes
          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/*
              StatCard = carte de statistique (composant créé par M1).
              On lui passe des "props" (propriétés) pour configurer son affichage.
              C'est comme remplir un formulaire : chaque prop = un champ.
            */}
            <StatCard
              label="MISSIONS CE MOIS"
              value={stats.missionsThisMonth}
              trend={stats.missionsTrend}
              icon="check-circle"
            />
            <StatCard
              label="GAINS DU MOIS"
              value={formatXAF(stats.monthlyEarnings)}
              trend={stats.earningsTrend}
              icon="banknote"
            />
            <StatCard
              label="MISSIONS TOTALES"
              value={stats.completedTotal}
              icon="star"
            />
            <StatCard
              label="DEVIS EN ATTENTE"
              value={stats.pendingQuotes}
              icon="file-text"
            />
          </div>
        </section>

        {/* ================================================================
            SECTION 2 — MISSIONS ACTIVES
            Ce sont les missions en cours ou à démarrer.
        ================================================================ */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Missions actives
          </h2>

          {/*
            RENDU CONDITIONNEL INLINE avec l'opérateur ternaire :
            condition ? <siVrai /> : <siFaux />

            Si activeMissions est vide (length === 0), on affiche EmptyState.
            Sinon, on affiche la liste.
          */}
          {activeMissions.length === 0 ? (
            <EmptyState
              icon="briefcase"
              title="Aucune mission active"
              description="Consultez les demandes disponibles pour en trouver une."
              actionLabel="Voir les demandes"
              onAction={() => {/* navigation vers /provider/demands */}}
            />
          ) : (
            <div className="space-y-3">
              {/*
                .map() = pour chaque élément du tableau, crée un JSX.
                C'est l'équivalent d'une boucle for, mais en React.

                La prop "key" est OBLIGATOIRE quand on utilise .map().
                React l'utilise en interne pour identifier chaque élément.
                On utilise toujours un ID unique (jamais l'index du tableau).
              */}
              {activeMissions.map((mission) => (
                <div
                  key={mission.id}
                  className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4 hover:shadow-sm transition-shadow"
                >
                  {/* Avatar client : cercle avec l'initiale */}
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {mission.clientInitial}
                  </div>

                  {/* Détails de la mission */}
                  <div className="flex-1 min-w-0">
                    {/* flex-1 = prend tout l'espace restant. min-w-0 = empêche le texte de déborder */}

                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-semibold text-gray-900 truncate">
                        {mission.clientName}
                      </p>
                      {/*
                        StatusBadge = pastille colorée selon le statut.
                        variant="en_cours" → bleu · variant="en_attente" → orange
                      */}
                      <StatusBadge
                        label={mission.status === "en_cours" ? "En cours" : "À démarrer"}
                        variant={mission.status}
                        size="sm"
                      />
                    </div>

                    <p className="text-sm text-gray-500 truncate mb-1">
                      {mission.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>📍 {mission.address}</span>
                      <span className="font-medium text-gray-700">
                        {formatXAF(mission.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================================================================
            SECTION 3 — HISTORIQUE DES MISSIONS RÉCENTES
        ================================================================ */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
            Missions récentes
          </h2>

          {recentMissions.length === 0 ? (
            <EmptyState
              icon="history"
              title="Aucune mission terminée"
              description="Vos missions terminées apparaîtront ici."
            />
          ) : (
            /*
              Table HTML classique pour afficher les données en colonnes.
              w-full = prend toute la largeur disponible.
            */
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Client
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Date
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Montant
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Note
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentMissions.map((mission, index) => (
                    <tr
                      key={mission.id}
                      /*
                        Alternance de couleurs sur les lignes pour la lisibilité.
                        index % 2 === 0 = ligne paire → fond légèrement gris
                        index % 2 !== 0 = ligne impaire → fond blanc
                        L'opérateur ternaire choisit la classe Tailwind à appliquer.
                      */
                      className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {mission.clientName}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {/*
                          new Date("2026-06-08").toLocaleDateString("fr-CM", {...})
                          = convertit "2026-06-08" en "8 juin 2026" en français.
                        */}
                        {new Date(mission.completedAt).toLocaleDateString("fr-CM", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        {formatXAF(mission.amount)}
                      </td>
                      <td className="px-4 py-3">
                        {/* Affichage de la note : étoiles statiques en texte */}
                        <span className="text-yellow-400">
                          {"★".repeat(mission.rating)}
                          {"☆".repeat(5 - mission.rating)}
                        </span>
                        <span className="text-gray-500 ml-1 text-xs">
                          {mission.rating}/5
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          label="Terminée"
                          variant="terminee"
                          size="sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </AppShell>
  );
}

// =============================================================================
// RÉSUMÉ DE CE QUE TU AS APPRIS DANS CE FICHIER
// =============================================================================
//
// 1. STRUCTURE D'UNE PAGE REACT
//    → Une fonction qui retourne du JSX (HTML dans JavaScript)
//    → export default = ce composant est le principal du fichier
//
// 2. LES ÉTATS (useState)
//    → const [valeur, setValeur] = useState(valeurInitiale)
//    → Quand setValeur() est appelé, la page se re-affiche automatiquement
//
// 3. CHARGER DES DONNÉES (useEffect)
//    → useEffect(() => { /* code */ }, []) = s'exécute 1 fois après l'affichage
//    → Pour l'instant : setTimeout qui simule un appel réseau
//    → En S3 : axios.get('/provider/dashboard') à la place
//
// 4. RENDU CONDITIONNEL
//    → if (isLoading) return <Spinner />   ← rendu précoce
//    → condition ? <A /> : <B />           ← opérateur ternaire inline
//
// 5. .MAP() POUR LES LISTES
//    → tableau.map((item) => <div key={item.id}>...</div>)
//    → toujours mettre key= avec un ID unique
//
// 6. LES PROPS (PARAMÈTRES D'UN COMPOSANT)
//    → <StatCard label="..." value={...} />
//    → ce sont les "arguments" qu'on passe au composant
//
// 7. LES CLASSES TAILWIND ESSENTIELLES
//    → grid / grid-cols-N / gap-N → mise en page en grille
//    → flex / items-center / gap-N → mise en page en ligne
//    → space-y-N → espace vertical entre les enfants
//    → sm:xxx / lg:xxx → responsive (adaptatif selon la taille d'écran)
//    → hover:xxx → style au survol
//    → truncate → coupe le texte avec "..." si trop long
//
// =============================================================================
//
// POUR ALLER PLUS LOIN (en S3 quand tu devras connecter la vraie API) :
//
// Remplace le setTimeout par :
//
//   import axios from "axios";
//
//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await axios.get("/provider/dashboard");
//         setData(res.data.data);
//       } catch (err) {
//         // Fallback mock si l'API plante (règle ServiLoc)
//         setData(mockData.data);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     load();
//   }, []);
//
// =============================================================================
