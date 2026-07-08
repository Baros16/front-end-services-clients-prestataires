// ============================================================
// FICHIER : src/components/provider/mission/PreDepartChecklist.jsx
// COMPOSANT : PreDepartChecklist (serviloc_composants.md §4.16)
// AUTEUR   : M4 · Kenfack
//
// CE COMPOSANT EST DANS NOTRE PÉRIMÈTRE (espace provider/mission)
// donc on le crée nous-même, contrairement aux composants "common/"
// qui appartiennent à M1.
//
// RÔLE : afficher une liste de cases à cocher avant de partir en
// mission (matériaux préparés, outils chargés, etc.)
// ============================================================

import React from 'react';

// -------------------------------------------------------
// PROPS ATTENDUES (d'après la doc composants) :
//   items    = tableau de { id, label, checked }
//   onToggle = fonction appelée avec l'id de l'item cliqué
// -------------------------------------------------------
export default function PreDepartChecklist({ items, onToggle }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/*
        .map() = on parcourt chaque item du tableau "items"
        et on affiche une ligne cliquable pour chacun
      */}
      {items.map(item => (
        <div
          key={item.id}
          // onClick = quand on clique n'importe où sur la ligne, on bascule la case
          onClick={() => onToggle(item.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            // Si coché → fond vert clair, sinon → fond gris très clair
            backgroundColor: item.checked ? '#F0FDF4' : '#F8FAFC',
            transition: 'background-color 0.15s',
          }}
        >
          {/* La case à cocher visuelle (carré avec ou sans coche) */}
          <div style={{
            width: '20px',
            height: '20px',
            minWidth: '20px', // Empêche le carré de se déformer si le label est long
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // Si coché → fond vert avec coche blanche, sinon → bordure grise vide
            backgroundColor: item.checked ? '#22C55E' : 'transparent',
            border: item.checked ? 'none' : '2px solid #CBD5E1',
            fontSize: '12px',
            color: '#FFFFFF',
            fontWeight: 700,
          }}>
            {/* On affiche la coche "✓" seulement si l'item est coché */}
            {item.checked && '✓'}
          </div>

          {/* Le texte du label */}
          <span style={{
            fontSize: '13px',
            color: item.checked ? '#15803D' : '#374151',
            fontWeight: item.checked ? 500 : 400,
            // textDecoration "line-through" = texte barré, seulement si coché
            // C'est exactement ce que demande la doc : "texte barré" quand coché
            textDecoration: item.checked ? 'line-through' : 'none',
          }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
