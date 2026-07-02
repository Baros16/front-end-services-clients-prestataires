// src/components/client/UrgencyBanner.jsx
import { useState, useEffect } from "react";
import CountdownTimer from "./CountdownTimer";

export default function UrgencyBanner({ category, description, location, countdownSeconds }) {
  const [secondsLeft, setSecondsLeft] = useState(countdownSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
      <div>
        <p className="font-bold text-red-600 text-lg">
          🔧 {category} — {description}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          📍 {location} · Recherche en cours...
        </p>
      </div>
      <CountdownTimer seconds={secondsLeft} />
    </div>
  );
}
