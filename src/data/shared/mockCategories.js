// src/data/shared/mockCategories.js
// Fallback mock — réponse de GET /client/categories et GET /admin/categories
// 6 ServiceCategory avec statistiques
// Format exact : API_CONTRACT §4.10

export const mockCategories = {
  success: true,
  data: [
    {
      id: "cat_plomberie",
      label: "Plomberie",
      iconKey: "wrench",
      color: "#dbeafe",
      demandCount: 47,
      percentageShare: 34,
    },
    {
      id: "cat_electricite",
      label: "Électricité",
      iconKey: "bolt",
      color: "#fef9c3",
      demandCount: 38,
      percentageShare: 27,
    },
    {
      id: "cat_menage",
      label: "Ménage",
      iconKey: "broom",
      color: "#dcfce7",
      demandCount: 22,
      percentageShare: 16,
    },
    {
      id: "cat_serrurerie",
      label: "Serrurerie",
      iconKey: "key",
      color: "#f3e8ff",
      demandCount: 14,
      percentageShare: 10,
    },
    {
      id: "cat_peinture",
      label: "Peinture",
      iconKey: "brush",
      color: "#ffe4e6",
      demandCount: 11,
      percentageShare: 8,
    },
    {
      id: "cat_sante",
      label: "Soins à domicile",
      iconKey: "plus",
      color: "#e0f2fe",
      demandCount: 7,
      percentageShare: 5,
    },
  ],
};
