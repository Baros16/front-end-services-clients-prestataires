// src/components/client/UrgencyBanner.jsx
import { useState, useEffect } from "react";
import { Wrench, MapPin } from "lucide-react";
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
    <div className="bg-danger-light border border-danger rounded-[var(--radius-lg)] p-4 flex items-center justify-between">
      <div>
        <p className="font-bold text-danger text-lg flex items-center gap-2">
          <Wrench size={16} />
          {category} — {description}
        </p>
        <p className="text-sm text-sl-500 mt-1 flex items-center gap-1">
          <MapPin size={16} />
          {location} · Recherche en cours...
        </p>
      </div>
      <CountdownTimer seconds={secondsLeft} />
    </div>
  );
}
