// src/components/layouts/ProviderLayout.jsx

import { Outlet, useNavigate } from 'react-router-dom';
import { AppShell } from '../commons';
import { Sidebar }  from '../commons';
import {
  Home,
  Search,
  FileText,
  CheckCircle,
  Wallet,
  User,
} from '../commons';
import { useActiveNavItem, getMockUser } from './_shared';
import { logout } from '../../services/authService';

const PROVIDER_NAV = [
  { id: 'dashboard', label: 'Tableau de bord',      icon: <Home        size={16} />, href: '/provider/dashboard' },
  { id: 'demandes',  label: 'Demandes disponibles', icon: <Search      size={16} />, href: '/provider/demandes'  },
  { id: 'devis',     label: 'Mes devis',            icon: <FileText    size={16} />, href: '/provider/devis'     },
  { id: 'missions',  label: 'Mes missions',          icon: <CheckCircle size={16} />, href: '/provider/missions'  },
  { id: 'gains',     label: 'Gains',                icon: <Wallet      size={16} />, href: '/provider/gains'     },
  { id: 'profil',    label: 'Mon profil',           icon: <User        size={16} />, href: '/provider/profil'    },
];

export function ProviderLayout() {
  const activeId = useActiveNavItem(PROVIDER_NAV);
  const user     = getMockUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/auth/login');
    }
  };

  return (
    <AppShell
      role="provider"
      sidebar={
        <Sidebar
          role="provider"
          items={PROVIDER_NAV}
          activeItemId={activeId}
          onLogout={handleLogout}
          user={{
            avatarInitial: user.name?.[0] ?? 'P',
            name:          user.name,
            subtitle:      'Prestataire',
          }}
        />
      }
    >
      <Outlet />
    </AppShell>
  );
}