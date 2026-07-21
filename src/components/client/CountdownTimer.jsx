// src/components/client/CountdownTimer.jsx
export default function CountdownTimer({ seconds }) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    <span className="text-3xl font-bold text-danger tabular-nums">
      {formatted}
    </span>
  );
}
