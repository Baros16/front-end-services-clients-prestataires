// src/components/service-client/LitigeDetailsPanel.jsx
import { createElement } from 'react';

function AttachmentLink({ att }) {
  return createElement(
    'a',
    {
      href: att.url,
      target: '_blank',
      rel: 'noreferrer',
      className: 'inline-flex items-center gap-1 px-2 py-1 border border-gray-200 rounded text-sm text-brand hover:bg-gray-50 transition-colors',
    },
    createElement('span', null, '📷'),
    createElement('span', null, ' ' + att.name)
  );
}

export default function LitigeDetailsPanel({ litige }) {
  if (!litige) return null;

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-bold text-lg mb-2">Détails du litige</h3>
      <p className="text-sm text-gray-500 mb-1">Référence : {litige.reference}</p>
      <p className="text-sm text-gray-500 mb-3">Statut : {litige.status}</p>

      <p className="font-semibold mb-1">Motif :</p>
      <p className="mb-3">{litige.motif}</p>

      <p className="font-semibold mb-1">Description du client :</p>
      <blockquote className="border-l-4 border-gray-300 pl-3 italic mb-3">
        {litige.clientDescription}
      </blockquote>

      {litige.attachments && litige.attachments.length > 0 && (
        <div className="mb-3">
          <p className="font-semibold mb-1">Pièces jointes :</p>
          <div className="flex flex-wrap gap-2">
            {litige.attachments.map(function (att) {
              return <AttachmentLink key={att.id} att={att} />;
            })}
          </div>
        </div>
      )}

      {litige.originalQuote && (
        <div>
          <p className="font-semibold mb-1">Devis original :</p>
          <table className="w-full text-sm">
            <tbody>
              <tr><td>Main d'œuvre</td><td className="text-right">{litige.originalQuote.labour} FCFA</td></tr>
              <tr><td>Matériaux</td><td className="text-right">{litige.originalQuote.materials} FCFA</td></tr>
              <tr className="font-bold"><td>Total</td><td className="text-right">{litige.originalQuote.total} FCFA</td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
