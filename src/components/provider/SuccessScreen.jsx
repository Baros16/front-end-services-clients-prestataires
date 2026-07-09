export default function SuccessScreen({
  icon,
  title,
  message,
  children,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">

      {icon}

      <h2 className="font-[family-name:var(--font-display)] text-[20px] font-bold text-sl-900 m-0">
        {title}
      </h2>

      <p className="text-[14px] text-sl-500 text-center max-w-sm m-0">
        {message}
      </p>

      {children}

    </div>
  );
}