// src/services/providerService.js
const BASE_URL = "https://api.serviloc.cm/v1";
const USE_MOCK = true;

// src/services/providerService.js
import axios from "axios";
import { getMock } from "./mockSwitch.js";
import mock_dashboard from "../data/provider/mock_dashboard.json";

const BASE_URL = "https://api.serviloc.cm/v1";
const USE_MOCK = true;
const BASE = "/provider";

function authHeaders() {
  const token = localStorage.getItem("serviloc_access");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getProviderDashboard() {
  return getMock(mock_dashboard, () => axios.get(`${BASE}/dashboard`));
}

export async function getAvailableDemands({ zone = "priority", page = 1, limit = 20, category = undefined } = {}) {
  if (USE_MOCK) {
    const mod = await import("../data/provider/mock_available_demands.json");
    return mod.default;
  }
  const params = new URLSearchParams({ zone, page, limit });
  if (category) params.set("category", category);
  const res = await fetch(`${BASE_URL}/provider/demands/available?${params}`, { headers: authHeaders() });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message ?? "Erreur serveur");
  return json;
}

export async function applyToDemand(demandId) {
  if (USE_MOCK) {
    return { success: true, data: { demandId, status: "applied", message: "Vous pouvez maintenant créer votre devis." } };
  }
  const res = await fetch(`${BASE_URL}/provider/demands/${demandId}/apply`, { method: "POST", headers: authHeaders() });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message ?? "Erreur serveur");
  return json;
}

export async function updateAvailability(isAvailable) {
  if (USE_MOCK) {
    return { success: true, data: { isAvailable } };
  }
  const res = await fetch(`${BASE_URL}/provider/availability`, {
    method: "PATCH", headers: authHeaders(), body: JSON.stringify({ isAvailable }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message ?? "Erreur serveur");
  return json;
}
export async function applyToDemand(demandId) {
  if (USE_MOCK) {
    return { success: true, data: { demandId, status: "applied", message: "Vous pouvez maintenant créer votre devis." } };
  }
  const res  = await fetch(`${BASE_URL}/provider/demands/${demandId}/apply`, { method: "POST", headers: authHeaders() });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message ?? "Erreur serveur");
  return json;
}

export async function updateAvailability(isAvailable) {
  if (USE_MOCK) {
    return { success: true, data: { isAvailable } };
  }
  const res  = await fetch(`${BASE_URL}/provider/availability`, {
    method: "PATCH", headers: authHeaders(), body: JSON.stringify({ isAvailable }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message ?? "Erreur serveur");
  return json;
}
