

const USE_MOCK = import.meta.env.VITE_USE_MOCK = false;
console.log("[mockSwitch] VITE_USE_MOCK =", import.meta.env.VITE_USE_MOCK);
console.log("[mockSwitch] USE_MOCK =", USE_MOCK);

/**
 * getMock — retourne les données mock ou appelle l'API selon VITE_USE_MOCK.
 *
 * @param {object} mockData  - Données mock importées depuis src/data/
 * @param {Function} apiFn   - Fonction async qui appelle l'API réelle
 * @returns {Promise<any>}   - data.data (payload métier uniquement, sans wrapper success/meta)
 */
export async function getMock(mockData, apiFn) {
  if (USE_MOCK) {
    // Simuler un délai réseau réaliste (300–700ms) pour tester les loaders
    await delay(300 + Math.random() * 400);
    // Retourner uniquement le payload métier (comme le ferait un vrai appel API)
    return mockData.data ?? mockData;
  }

  try {
    const response = await apiFn();
    // L'API renvoie { success: true, data: {...} } — on extrait data
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("[ServiLoc API Error]", error);
    throw error;
  }
}

/**
 * getMockList — variante pour les listes paginées.
 * Retourne { data, meta } au lieu de data seul.
 *
 * @param {object} mockData  - Données mock avec data[] et meta
 * @param {Function} apiFn   - Fonction async qui appelle l'API réelle
 * @returns {Promise<{ data: any[], meta: object }>}
 */
export async function getMockList(mockData, apiFn) {
  if (USE_MOCK) {
    await delay(300 + Math.random() * 400);
    return {
      data: mockData.data ?? [],
      meta: mockData.meta ?? { page: 1, limit: 20, total: 0, totalPages: 1 },
    };
  }

  try {
    const response = await apiFn();
    const body = response.data ?? {};

    // Deux formes possibles côté API (voir doc) :
    // 1) PagedResponse<T> brut  : { content, page, limit, totalElements, totalPages }
    //    → GET /client/demands, GET /client/missions
    // 2) ApiResponse<List<T>>   : { success, data: [...] } — pas de pagination
    //    → GET /provider/demands, GET /provider/missions,
    //      GET /client/providers/search, GET /client/demands/{id}/applications
    if (Array.isArray(body.content)) {
      return {
        data: body.content,
        meta: {
          page: body.page ?? 1,
          limit: body.limit ?? 20,
          total: body.totalElements ?? 0,
          totalPages: body.totalPages ?? 1,
        },
      };
    }

    const list = Array.isArray(body.data) ? body.data : (Array.isArray(body) ? body : []);
    return {
      data: list,
      meta: { page: 1, limit: list.length, total: list.length, totalPages: 1 },
    };
  } catch (error) {
    console.error("[ServiLoc API Error]", error);
    throw error;
  }
}
// Helper interne
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { USE_MOCK };
