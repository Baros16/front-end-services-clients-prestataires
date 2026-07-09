import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionCard from '../../components/common/SectionCard';
import LoginForm from '../../components/auth/LoginForm';
import { login } from '../../services/authService';
 
export default function ServiceClientLoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
 
  const handleSubmit = async ({ email, password }) => {
    setError('');
 
    try {
      const { accessToken, refreshToken, user } = await login(email, password);
 
      // Sécurité : cet écran est réservé aux agents Service Client.
            // Même si /auth/login accepte tous les rôles, on bloque ici
      // toute connexion qui ne serait pas un agent.
      if (user.role !== 'agent') {
        setError("Ce compte n'a pas accès à l'espace Service Client.");
        return;
      }
 
      // Clés de stockage définies dans API_CONTRACT.md (section 2.2)
      localStorage.setItem('serviloc_access', accessToken);
      localStorage.setItem('serviloc_refresh', refreshToken);
 
      navigate('/agent/dashboard', { replace: true });
    } catch (err) {
      const apiError = err?.response?.data?.error;
 
      switch (apiError?.code) {
        case 'INVALID_CREDENTIALS':
          setError('Email ou mot de passe incorrect.');
          break;
        case 'ACCOUNT_BLOCKED':
          setError('Compte bloqué après plusieurs tentatives échouées.');
          break;
        case 'ACCOUNT_SUSPENDED':
          setError(apiError.message || 'Ce compte a été suspendu.');
          break;
        default:
          setError('Une erreur est survenue. Veuillez réessayer.');
      }
    }
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-sl-50 px-4">
      <div className="w-full max-w-md">
        {/* Icône casque */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-brand-xlight flex items-center justify-center">
            <HeadsetIcon />
          </div>
        </div>
 
        <SectionCard>
          <h1 className="font-display text-xl font-semibold text-center text-sl-900 mb-1">
            Espace Service Client
          </h1>
          <p className="text-sm text-sl-500 text-center mb-6">
            Réservé aux agents ServiLoc
          </p>
 
          <LoginForm
            submitLabel="Se connecter"
            error={error}
            infoMessage="Cet espace est réservé aux agents. L'accès est limité à la gestion des litiges et des dossiers prestataires."
            infoVariant="info"
            onSubmit={handleSubmit}
          />
        </SectionCard>
      </div>
    </div>
  );
}
 
function HeadsetIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="text-brand"
      aria-hidden="true"
    >
      <path d="M3 14v-2a9 9 0 0 1 18 0v2" strokeLinecap="round" />
      <path d="M21 15.5a2.5 2.5 0 0 1-2.5 2.5H17v-6h1.5A2.5 2.5 0 0 1 21 14.5v1z" />
      <path d="M3 15.5A2.5 2.5 0 0 0 5.5 18H7v-6H5.5A2.5 2.5 0 0 0 3 14.5v1z" />
      <path d="M17 18v1a2 2 0 0 1-2 2h-2" strokeLinecap="round" />
    </svg>
  );
}
 
