// src/main.jsx

console.log("API URL au build :", import.meta.env.VITE_API_BASE_URL);
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "./router/AppRouter";
import './utils/leafletIconFix.js';
import 'leaflet/dist/leaflet.css';
import "./styles/tokens.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
