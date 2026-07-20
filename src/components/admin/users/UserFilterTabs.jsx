// src/components/admin/users/UserFilterTabs.jsx
import { TabBar } from '../../commons';

export default function UserFilterTabs({ activeTabId, onChange, users = [] }) {
  const tabs = [
    { id: 'all',       label: 'Tous',          count: users.length },
    { id: 'client',    label: 'Clients',       count: users.filter(u => u.role === 'client').length },
    { id: 'provider',  label: 'Prestataires',  count: users.filter(u => u.role === 'provider').length },
    { id: 'suspended', label: 'Suspendus',     count: users.filter(u => u.status === 'suspended').length },
  ];

  return (
    <TabBar
      tabs={tabs}
      activeId={activeTabId}
      onChange={onChange}
    />
  );
}