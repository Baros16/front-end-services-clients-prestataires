// src/components/layouts/ClientLayout.jsx

import { Outlet, useNavigate } from 'react-router-dom';
import { AppShell } from '../commons';
import { Sidebar }  from '../commons';
import {
  Home,
  ClipboardList,
  Plus,
  MapPin,
  MessageCircle,
  Star,
} from '../commons';
import { useActiveNavItem, getMockUser } from './_shared';
import { logout } from '../../services/authService';

const CLIENT_NAV = [
  { id: 'dashboard',        label: 'Tableau de bord',  icon: <Home          size={16} />, href: '/client/dashboard'        },
  { id: 'demandes',         label: 'Mes demandes',      icon: <ClipboardList size={16} />, href: '/client/demandes'         },
  { id: 'nouvelle-demande', label: 'Nouvelle demande',  icon: <Plus          size={16} />, href: '/client/nouvelle-demande' },
  { id: 'missions',         label: 'Mes missions',      icon: <MapPin        size={16} />, href: '/client/missions'         },
  { id: 'messages',         label: 'Messages',          icon: <MessageCircle size={16} />, href: '/client/chat',            },
];

export function ClientLayout() {
  const activeId = useActiveNavItem(CLIENT_NAV);
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
      role="client"
      sidebar={
        <Sidebar
          role="client"
          items={CLIENT_NAV}
          activeItemId={activeId}
          onLogout={handleLogout}
          user={{
            avatarInitial: user.name?.[0] ?? 'U',
            name:          user.name,
            subtitle:      'Client',
          }}
        />
      }
    >
      <Outlet />
    </AppShell>
  );
}