// src/components/common/AvailabilityToggle.jsx

export function AvailabilityToggle({ isAvailable, onChange, isLoading = false }) {
  function handleClick() {
    if (isLoading) return;
    onChange?.(!isAvailable);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isAvailable}
      onClick={handleClick}
      disabled={isLoading}
      className={[
        'relative flex items-center gap-3 px-4 py-2.5 rounded-[var(--radius-md)] border-2',
        'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
        isLoading
          ? 'border-[var(--color-sl-200)] bg-[var(--color-sl-50)] cursor-wait'
          : isAvailable
            ? 'border-[var(--color-success)]/30 bg-[var(--color-success)]/8 focus-visible:ring-[var(--color-success)]'
            : 'border-[var(--color-sl-200)] bg-[var(--color-sl-50)] focus-visible:ring-[var(--color-sl-400)]',
      ].join(' ')}
    >
      {/* Track — pill toggle */}
      <div
        className={[
          'relative w-10 h-[22px] rounded-full transition-colors duration-300',
          isLoading
            ? 'bg-[var(--color-sl-200)]'
            : isAvailable
              ? 'bg-[var(--color-success)]'
              : 'bg-[var(--color-sl-300)]',
        ].join(' ')}
      >
        {/* Thumb */}
        <span
          className={[
            'absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm',
            'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
            isAvailable && !isLoading ? 'left-[22px]' : 'left-[3px]',
          ].join(' ')}
        />

        {/* Loader spinner — visible uniquement pendant isLoading */}
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
          </span>
        )}
      </div>

      {/* Label */}
      <span
        className={[
          'text-[13px] font-semibold font-[family-name:var(--font-body)] whitespace-nowrap',
          'transition-colors duration-300',
          isLoading
            ? 'text-[var(--color-sl-400)]'
            : isAvailable
              ? 'text-[var(--color-success)]'
              : 'text-[var(--color-sl-500)]',
        ].join(' ')}
      >
        {isLoading ? 'Mise à jour...' : isAvailable ? 'Disponible' : 'Indisponible'}
      </span>
    </button>
  );
}