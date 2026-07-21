// src/components/admin/validation/ActionPanel.jsx

import { AlertTriangle }                           from '../../commons';
import { Button, AlertBanner, Avatar,
         RatingStars, Card }                       from '../../commons';

export function ActionPanel({
  provider, documents,
  onValider, onRefuser, onEnvoyerSMS,
  loading,
}) {
  const missingDocs = documents.filter(d => d.status === 'manquant');
  const hasMissing  = missingDocs.length > 0;

  return (
    <div className="flex flex-col gap-4" style={{ width: 340, flexShrink: 0 }}>

      <Card title="Photo de profil">
        <div className="flex flex-col items-center text-center gap-2 py-2">
          <Avatar initial={provider.avatarInitial} size="lg" />
          <RatingStars value={provider.rating} readonly showValue size="sm" />
          <p className="text-xs"
            style={{ color: 'var(--color-sl-400)', fontFamily: 'var(--font-body)' }}>
            Nouveau prestataire
          </p>
        </div>
      </Card>

      <Button
        label=""
        onClick={onValider}
        disabled={loading || hasMissing}
        fullWidth
      > Valider le prestataire</Button>

      <Button
        variant='danger'
        onClick={onRefuser}
        disabled={loading}
        fullWidth
        className=''
      >Refuser le dossier</Button>

      {hasMissing && (
        <>
          <AlertBanner
            type="warning"
            message={`${missingDocs.map(d => d.label).join(', ')} est requis. Notifier le prestataire ?`}
          />
          <Button
              variant='ghost'
              onClick={onEnvoyerSMS}
              disabled={loading}
              fullWidth
              >Envoyer un rappel SMS</Button>
        </>
      )}
    </div>
  );
}