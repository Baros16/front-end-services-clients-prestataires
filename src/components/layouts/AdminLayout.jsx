// src/components/layouts/AdminLayout.jsx

import { useState }  from 'react';
import { Outlet }    from 'react-router-dom';
import { AppShell }  from '../commons';
import { Sidebar }   from '../commons';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Scale,
  BarChart2,
} from '../commons';
import { useActiveNavItem, getMockUser } from './_shared';

const ADMIN_NAV = [
  { id: 'dashboard',    label: 'Tableau de bord',        icon: <LayoutDashboard size={16} />, href: '/admin/dashboard'    },
  { id: 'validation',   label: 'Validation prestataire', icon: <UserCheck       size={16} />, href: '/admin/validation',  count: 3 },
  { id: 'utilisateurs', label: 'Utilisateurs',           icon: <Users           size={16} />, href: '/admin/utilisateurs' },
  { id: 'litiges',      label: 'Litiges',                icon: <Scale           size={16} />, href: '/admin/litiges',     count: 7 },
  { id: 'statistiques', label: 'Statistiques',           icon: <BarChart2       size={16} />, href: '/admin/statistiques' },
];

export function AdminLayout() {
  const [litigesCount] = useState(7);
  const activeId = useActiveNavItem(ADMIN_NAV);
  const user     = getMockUser();

  const navWithCount = ADMIN_NAV.map(item =>
    item.id === 'litiges' ? { ...item, count: litigesCount } : item
  );

  return (
    <AppShell
      role="admin"
      sidebar={
        <Sidebar
          role="admin"
          items={navWithCount}
          activeItemId={activeId}
          user={{
            avatarInitial: user.name?.[0] ?? 'A',
            name:          user.name,
            subtitle:      'Administrateur',
          }}
        />
      }
    >
      <Outlet />
    </AppShell>
  );
}