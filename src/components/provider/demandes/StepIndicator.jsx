// src/components/client/demand/StepIndicator.jsx

/**
 * StepIndicator — Indicateur de progression 5 étapes
 * Props:
 *   steps: Array<{ number: number; label: string }>
 *   currentStep: number (1-based)
 */
export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center min-w-[420px]">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isActive    = step.number === currentStep;
          const isLast      = index === steps.length - 1;

          return (
            <div key={step.number} className="flex items-center flex-1 last:flex-none">
              {/* Cercle + label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-all duration-200
                    ${isCompleted
                      ? 'bg-[var(--color-brand)] text-white'
                      : isActive
                      ? 'bg-[var(--color-sl-900)] text-white'
                      : 'bg-[var(--color-sl-200)] text-[var(--color-sl-400)]'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={`
                    text-[11px] font-medium whitespace-nowrap
                    ${isActive ? 'text-[var(--color-sl-900)]' : isCompleted ? 'text-[var(--color-brand)]' : 'text-[var(--color-sl-400)]'}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Ligne de connexion */}
              {!isLast && (
                <div className="flex-1 mx-2 mb-5">
                  <div
                    className={`h-[2px] transition-all duration-300 ${
                      isCompleted ? 'bg-[var(--color-brand)]' : 'bg-[var(--color-sl-200)]'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}