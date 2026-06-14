// ============================================================
// FICHIER : src/data/provider/mockDashboardProvider.js
// RÔLE : Contient les FAUSSES données pour tester le dashboard
//        En S3, ces données viendront du vrai serveur (API)
//        Pour l'instant, on les écrit à la main ici
// RESPONSABLE : M4 · Kenfack
// ============================================================

// -------------------------------------------------------
// Les 4 cartes de chiffres clés (MetricCards) en haut
// Chaque objet { } = une carte
// -------------------------------------------------------
export const mockMetrics = [
  {
    id: 1,
    label: 'Missions en cours',   // Titre affiché sur la carte
    value: '3',                    // Le gros chiffre
    icon: '🔧',
    couleur: '#3B82F6',           // Bleu
    sousTitre: 'Actuellement actives',
  },
  {
    id: 2,
    label: 'Missions terminées',
    value: '27',
    icon: '✅',
    couleur: '#10B981',           // Vert
    sousTitre: 'Ce mois-ci',
  },
  {
    id: 3,
    label: 'Gains du mois',
    value: '84 500 XAF',
    icon: '💰',
    couleur: '#F59E0B',           // Orange
    sousTitre: 'Revenus nets prestataire',
  },
  {
    id: 4,
    label: 'Note moyenne',
    value: '4.7 ⭐',
    icon: '⭐',
    couleur: '#8B5CF6',           // Violet
    sousTitre: 'Sur 27 évaluations clients',
  },
];

// -------------------------------------------------------
// Les missions récentes (liste des dernières missions)
// statut possible : 'EN_COURS' | 'TERMINEE' | 'EN_ATTENTE' | 'ANNULEE'
// -------------------------------------------------------
export const mockMissionsRecentes = [
  {
    id: 1,
    titre: 'Réparation plomberie cuisine',
    client: 'Marie Tchoupo',
    statut: 'EN_COURS',
    date: '2026-06-12',
    montant: '15 000 XAF',
  },
  {
    id: 2,
    titre: 'Installation électrique bureau',
    client: 'Paul Nganou',
    statut: 'TERMINEE',
    date: '2026-06-10',
    montant: '35 000 XAF',
  },
  {
    id: 3,
    titre: 'Peinture salon appartement',
    client: 'Sophie Kamga',
    statut: 'EN_COURS',
    date: '2026-06-08',
    montant: '28 000 XAF',
  },
  {
    id: 4,
    titre: 'Entretien jardin + taille haie',
    client: 'Jean Fotso',
    statut: 'EN_ATTENTE',
    date: '2026-06-15',
    montant: '8 000 XAF',
  },
  {
    id: 5,
    titre: 'Déménagement complet',
    client: 'Alice Mbarga',
    statut: 'TERMINEE',
    date: '2026-06-05',
    montant: '45 000 XAF',
  },
];

// -------------------------------------------------------
// Planning des disponibilités : les 7 prochains jours
// On génère automatiquement avec une fonction JavaScript
// -------------------------------------------------------
export const genererPlanningDisponibilite = () => {
  // Les noms courts des jours de la semaine en français
  // getDay() retourne 0=Dim, 1=Lun, 2=Mar... donc le tableau suit cet ordre
  const nomsJours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const jours = [];

  // Boucle : on répète 7 fois (i va de 0 à 6)
  for (let i = 0; i < 7; i++) {
    const date = new Date();          // Date d'aujourd'hui
    date.setDate(date.getDate() + i); // On avance de i jours

    jours.push({
      // toISOString() = format "2026-06-14T00:00:00.000Z"
      // .split('T')[0] = on garde juste "2026-06-14"
      date: date.toISOString().split('T')[0],

      nomJour: nomsJours[date.getDay()], // Ex : "Lun"
      numeroJour: date.getDate(),         // Ex : 14

      // Aujourd'hui (i === 0) : toujours "occupé" car on est en mission
      // Les autres jours : 60% de chance d'être disponible (Math.random() > 0.4)
      disponible: i === 0 ? false : Math.random() > 0.4,

      // Nombre de missions ce jour (0 à 3 au hasard)
      nbMissions: i === 0 ? 1 : Math.floor(Math.random() * 3),
    });
  }

  return jours;
};