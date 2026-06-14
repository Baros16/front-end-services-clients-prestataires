
// src/services/sharedService.js

import axios from "axios";
import { getMock } from "./mockSwitch.js";
import { mockCategories } from "../data/shared/mockCategories.js";
import { mockLitigeMotifs } from "../data/shared/mockLitigeMotifs.js";

export async function getCategories() {
  return getMock(mockCategories, () => axios.get("/client/categories"));
}

export async function getLitigeMotifs() {
  return getMock(mockLitigeMotifs, () => axios.get("/shared/litige-motifs"));
}
