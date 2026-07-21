// src/services/clientService.js

import mockDashboard from '../data/client/mock_dashboard.json';

export function getClientDashboard() {
    return Promise.resolve(mockDashboard.data);
}
