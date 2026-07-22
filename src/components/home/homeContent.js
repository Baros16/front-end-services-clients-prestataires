// src/components/home/homeContent.js
import {
  Wrench,
  Lightning,
  Broom,
  Lock,
  PaintRoller,
  SquaresFour,
} from '../commons/IconsPhosphor';

export const NAV_LINKS = [
  { label: 'Catégories', href: '#categories' },
  { label: 'Fonctionnement', href: '#fonctionnement' },
  { label: 'Sécurité', href: '#securite' },
  { label: 'Prestataires', href: '#prestataires' },
];

export const CATEGORIES = [
  { id: 'plomberie', label: 'Plomberie', icon: Wrench, bg: 'bg-cat-plomberie/10', text: 'text-cat-plomberie' },
  { id: 'electricite', label: 'Électricité', icon: Lightning, bg: 'bg-cat-electricite/10', text: 'text-cat-electricite' },
  { id: 'nettoyage', label: 'Nettoyage', icon: Broom, bg: 'bg-cat-nettoyage/10', text: 'text-cat-nettoyage' },
  { id: 'serrurerie', label: 'Serrurerie', icon: Lock, bg: 'bg-cat-serrurerie/10', text: 'text-cat-serrurerie' },
  { id: 'peinture', label: 'Peinture', icon: PaintRoller, bg: 'bg-cat-peinture/10', text: 'text-cat-peinture' },
  { id: 'autre', label: 'Autre service', icon: SquaresFour, bg: 'bg-cat-autre/10', text: 'text-cat-autre' },
];

export const STEPS = [
  { number: '01', title: 'Décrivez votre besoin', text: 'Catégorie, description, photos — moins de deux minutes.' },
  { number: '02', title: 'Comparez les devis', text: 'Des prestataires vérifiés près de chez vous répondent avec un prix et un délai.' },
  { number: '03', title: 'Payez en confiance', text: 'Le paiement Mobile Money est séquestré, libéré après validation.' },
];

export const TESTIMONIALS = [
  { initial: 'A', name: 'Aïcha N.', city: 'Bafoussam', rating: 5, quote: "Le prestataire est arrivé en moins d'une heure pour une fuite d'eau urgente." },
  { initial: 'S', name: 'Serge T.', city: 'Douala', rating: 5, quote: "J'ai comparé trois devis d'électriciens en une soirée, tout depuis mon téléphone." },
  { initial: 'M', name: 'Marlène K.', city: 'Yaoundé', rating: 4, quote: 'En tant que prestataire, mes gains sont libérés rapidement après chaque mission.' },
];

export const FOOTER_COLUMNS = [
  { title: 'Plateforme', links: ['Catégories', 'Fonctionnement', 'Mode urgence', 'Commissions'] },
  { title: 'Prestataires', links: ['Devenir prestataire', "Zone d'intervention", 'Validation du dossier', 'Historique des gains'] },
  { title: 'Assistance', links: ['Centre d’aide', 'Service client', 'Signaler un litige', 'Paiements sécurisés'] },
  { title: 'Entreprise', links: ['À propos', 'Conditions générales', 'Confidentialité', 'Contact'] },
];

export const EXAMPLE_QUERIES = [
  "Fuite d'eau sous l'évier, urgent…",
  'Peinture salon 20m², 2 couches…',
  "Serrure bloquée, porte d'entrée…",
  'Installation prise électrique…',
];

export const INITIAL_DEMANDS = [
  { id: 'd1', label: 'Fuite d’eau — Bafoussam', priority: 'Urgent' },
  { id: 'd2', label: 'Peinture salon — Douala', priority: 'Standard' },
  { id: 'd3', label: 'Prise électrique — Yaoundé', priority: 'Standard' },
  { id: 'd4', label: 'Serrure bloquée — Bamenda', priority: 'Urgent' },
];

export const STREAM_ITEMS = [
  { label: 'Plomberie', value: '128 missions' },
  { label: 'Électricité', value: '94 missions' },
  { label: 'Nettoyage', value: '211 missions' },
  { label: 'Serrurerie', value: '67 missions' },
  { label: 'Peinture', value: '83 missions' },
];