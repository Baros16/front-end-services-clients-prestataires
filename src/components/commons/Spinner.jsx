
export function Spinner({ size = "md", colorClass = "border-t-brand" }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-[2.5px]",
    lg: "w-9 h-9 border-[3px]",
  };

  return (
    <div
      className={`
        ${sizes[size]} ${colorClass}
        rounded-full border-sl-200 sl-animate-spin inline-block
      `}
    />
  );
}
