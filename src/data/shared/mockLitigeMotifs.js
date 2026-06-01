// src/data/shared/mockLitigeMotifs.js
// Fallback mock — motifs disponibles pour le formulaire "Signaler un litige"
// Utilisé dans l'écran Client UC12

export const mockLitigeMotifs = {
  success: true,
  data: [
    {
      id: "motif_incomplete",
      title: "Prestation incomplète",
      description: "Les travaux prévus n'ont pas été entièrement réalisés",
    },
    {
      id: "motif_qualite",
      title: "Mauvaise qualité",
      description: "La qualité de la prestation est insuffisante ou ne correspond pas aux attentes",
    },
    {
      id: "motif_non_venu",
      title: "Prestataire absent",
      description: "Le prestataire ne s'est pas présenté au rendez-vous convenu",
    },
    {
      id: "motif_surfacturation",
      title: "Surfacturation",
      description: "Le montant final facturé dépasse le devis initial sans accord préalable",
    },
  ],
};
