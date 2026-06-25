// src/data/client/mockNearbyProviders.js
export const mockNearbyProviders = [
  {
    id: "prov_001",
    name: "Jean-Claude T.",
    specialty: "Plombier",
    rating: 4.7,
    distanceKm: 1.2,
    hourlyRate: 3500,
    availability: "available",
  },
  {
    id: "prov_002",
    name: "Marie A.",
    specialty: "Électricienne",
    rating: 4.9,
    distanceKm: 2.4,
    hourlyRate: 4000,
    availability: "available",
  },
  {
    id: "prov_003",
    name: "Paul N.",
    specialty: "Plombier",
    rating: 4.3,
    distanceKm: 3.1,
    hourlyRate: 3000,
    availability: "soon",
  },
  {
    id: "prov_004",
    name: "Sandrine K.",
    specialty: "Serrurière",
    rating: 4.6,
    distanceKm: 0.8,
    hourlyRate: 4500,
    availability: "available",
  },
];

export const mockUrgencyContext = {
  category: "Plomberie",
  description: "Fuite d'eau importante dans la cuisine",
  location: "Bafoussam, Quartier Tamdja",
  countdownSeconds: 900,
};
