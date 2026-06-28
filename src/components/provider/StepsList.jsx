export function StepsList({ steps }) {
  if (!steps?.length) return null;
  return (
    <div className="space-y-2">
      {steps.map((step) => (
        <div key={step.id} className="flex items-center gap-2.5">
          <span className={`text-base flex-shrink-0 ${step.completed ? 'text-green-500' : 'text-sl-300'}`}>
            {step.completed ? '✓' : '○'}
          </span>
          <span className={`text-sm ${step.completed ? 'line-through text-sl-400' : 'text-sl-800'}`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}
