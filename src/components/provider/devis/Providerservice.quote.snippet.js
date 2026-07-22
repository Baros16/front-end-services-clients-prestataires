// ─────────────────────────────────────────────────────────────────────────
// À FUSIONNER dans src/services/providerService.js existant.
// Suit la convention API_CONTRACT.md §11 (VITE_USE_MOCK) déjà en place
// pour clentService.js / providerService.js.
// ─────────────────────────────────────────────────────────────────────────
import axios from './axiosInstance'; // adapter au client HTTP déjà utilisé dans le projet

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * POST /provider/demands/:demandId/quote  (API_CONTRACT.md §7)
 * @param {string} demandId
 * @param {{
 *   laborDescription: string,
 *   laborAmount: number,
 *   materials: { designation: string, quantity: number, unitPrice: number }[],
 *   estimatedDurationHours: number,
 * }} payload
 * @returns {Promise<Quote>}
 */
export async function createQuote(demandId, payload) {
  if (USE_MOCK) {
    // Simule la latence réseau et renvoie un Quote conforme au schéma §4.5
    await new Promise((resolve) => setTimeout(resolve, 600));
    const materialsTotal = payload.materials.reduce(
      (sum, m) => sum + m.quantity * m.unitPrice,
      0
    );
    return {
      id: `quote_${Date.now()}`,
      demandId,
      reference: `DEV-2026-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`,
      status: 'en_attente',
      ...payload,
      materialsTotal,
      totalAmount: payload.laborAmount + materialsTotal,
      validityDays: 5,
      createdAt: new Date().toISOString(),
    };
  }

  const res = await axios.post(`/provider/demands/${demandId}/quote`, payload);
  return res.data.data;
}