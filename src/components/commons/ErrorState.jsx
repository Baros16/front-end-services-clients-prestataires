import { AlertTriangle } from './Icons';
import { Button } from './Button';

export function ErrorState({
  icon = <AlertTriangle size={40} strokeWidth={1.5} />,
  title = "Une erreur est survenue",
  subtitle = "Impossible de charger les données. Vérifiez votre connexion et réessayez.",
  action = (
    <Button variant="primary" onClick={() => window.location.reload()}>
      Réessayer
    </Button>
  ),
  className = "",
}) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center gap-4
        py-12 px-6 text-center sl-animate-fade-in
        ${className}
      `}
    >
      <span className="text-danger/80">{icon}</span>

      <div>
        <p className="m-0 font-[family-name:var(--font-display)] font-bold text-[16px] text-sl-700">
          {title}
        </p>
        {subtitle && (
          <p className="m-0 mt-1 text-[13px] text-sl-400 max-w-sm">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}