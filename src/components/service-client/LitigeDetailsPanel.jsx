// src/components/service-client/LitigeDetailsPanel.jsx
import { createElement } from 'react';
import { Card } from '../commons/Card';

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
    createElement('span', { className: 'truncate max-w-[90px]', title: att.name }, ' ' + att.name)
  );
}

export default function LitigeDetailsPanel({ litige }) {
  if (!litige) return null;

  return (
    <Card title="Détails du litige">
      <p className="text-sm text-gray-500 mb-1">Référence : {litige.reference}</p>
      <p className="text-sm text-gray-500 mb-3">Statut : {litige.status}</p>

      <p className="font-semibold mb-1">Motif :</p>
      <p className="mb-3">{litige.motif}</p>

      <p className="font-semibold mb-1">Description du client :</p>
      <blockquote className="bg-gray-100 rounded-lg rounded-tl-none p-3 text-sm not-italic mb-3">
        {litige.clientDescription}
      </blockquote>

      {litige.attachments && litige.attachments.length > 0 && (
        <div className="mb-3">
          <p className="font-semibold mb-1">Pièces jointes :</p>
          <div className="flex flex-row flex-nowrap gap-2 overflow-x-auto">
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
    </Card>
  );
}
