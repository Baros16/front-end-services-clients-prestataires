// src/utils/leafletIconFix.js
// Fix Vite + Leaflet : les icônes par défaut de Leaflet ne se chargent
// pas avec Vite car les chemins d'assets sont résolus différemment.
// Ce fichier DOIT être importé une seule fois dans src/main.jsx
// AVANT tout import de composant Leaflet.

import L from 'leaflet';
import iconUrl        from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl  from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl      from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize:    [25, 41],
  iconAnchor:  [12, 41],
  shadowSize:  [41, 41],
  popupAnchor: [1, -34],
});