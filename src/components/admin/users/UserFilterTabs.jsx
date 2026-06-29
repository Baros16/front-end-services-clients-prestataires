// src/components/admin/users/UserFilterTabs.jsx
import { TabBar } from '../../commons';
const TABS = [
{ id: 'all', label: 'Tous', count: 5 },
{ id: 'client', label: 'Clients', count: 2 },
{ id: 'provider', label: 'Prestataires', count: 2 },
{ id: 'suspended', label: 'Suspendus', count: 1 },
];
export default function UserFilterTabs({ activeTabId, onChange }) {
return (
<TabBar
tabs={TABS}
activeTabId={activeTabId}
onChange={onChange}
/>
);
}