// src/components/client/UrgencyBanner.jsx
import { useState, useEffect } from 'react';
import CountdownTimer from './CountdownTimer';

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
    <div className="bg-red-600 text-white rounded-lg p-4 flex items-center justify-between">
      <div>
        <p className="font-bold text-lg">{category}</p>
        <p className="text-sm">{description}</p>
        <p className="text-xs mt-1">📍 {location} — Recherche en cours...</p>
      </div>
      <CountdownTimer seconds={secondsLeft} />
    </div>
  );
}
