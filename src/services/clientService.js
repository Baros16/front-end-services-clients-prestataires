// src/services/clientService.js
import axios from "axios";
import { getMock, getMockList } from "./mockSwitch.js";
import mockUrgencyProviders from "../data/client/mock_urgency_providers.json";
import mockUrgencyContext from "../data/client/mock_urgency_context.json";

const BASE = "/client";

export async function getUrgencyProviders() {
  return getMockList(mockUrgencyProviders, () =>
    axios.get(`${BASE}/providers/search`)
  );
}

export async function getUrgencyContext() {
  return getMock(mockUrgencyContext, () =>
    axios.get(`${BASE}/urgency/context`)
  );
}
