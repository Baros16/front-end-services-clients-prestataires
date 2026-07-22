// src/components/layouts/ServiceClientLayout.jsx
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppShell } from '../commons';
import { Sidebar } from '../commons';
import {
  LayoutDashboard,
  Scale,
  UserCheck,
  Settings,
} from '../commons';
import { useActiveNavItem, getMockUser } from './_shared';
import { logout } from '../../services/authService';

const SC_NAV = [
  { id: 'dashboard',  label: 'Tableau de bord', icon: <LayoutDashboard size={16} />, href: '/service-client/dashboard' },
  { id: 'litiges',    label: 'Litiges',          icon: <Scale           size={16} />, href: '/service-client/litiges', count: 7 },
  { id: 'validation', label: 'Validations',      icon: <UserCheck        size={16} />, href: '/service-client/validation' },
];

export function ServiceClientLayout() {
  const [litigesCount] = useState(7);
  const activeId = useActiveNavItem(SC_NAV);
  const user = getMockUser();
  const navigate = useNavigate();

  const navWithCount = SC_NAV.map(item =>
    item.id === 'litiges' ? { ...item, count: litigesCount } : item
  );

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/auth/login');
    }
  };

  return (
    <AppShell
      role="service_client"
      sidebar={
        <Sidebar
          role="service_client"
          items={navWithCount}
          activeItemId={activeId}
          onLogout={handleLogout}
          user={{
            avatarInitial: user.name?.[0] ?? 'S',
            name:          user.name,
            subtitle:      'Agent Service Client',
          }}
        />
      }
    >
      <Outlet />
    </AppShell>
  );
}