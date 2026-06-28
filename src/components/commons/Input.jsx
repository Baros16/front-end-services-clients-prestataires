
import { useState } from "react";

export function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  name,
  className = "",
  leftIcon,
  rightIcon,
}) {
  const [focused, setFocused] = useState(false);
  const isTextarea = type === "textarea";

  const inputBase =
    "w-full font-[family-name:var(--font-body)] text-[14px] px-3 py-[10px] " +
    "rounded-[var(--radius-sm)] outline-none transition-all duration-150 " +
    "placeholder:text-sl-300";
  const iconPaddingClass = leftIcon || rightIcon ? "pr-10" : "";

  const inputState = error
    ? "border-[1.5px] border-danger"
    : focused
    ? "border-[1.5px] border-brand shadow-[0_0_0_3px_rgba(27,67,50,0.08)]"
    : "border-[1.5px] border-sl-200 hover:border-sl-300";

  const inputColor = disabled
    ? "bg-sl-50 text-sl-400 cursor-not-allowed"
    : "bg-white text-sl-900";

  const sharedProps = {
    name,
    value,
    placeholder,
    disabled,
    onChange: (e) => onChange?.(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className: `${inputBase} ${iconPaddingClass} ${inputState} ${inputColor}`,
  };

  return (
    <div className={`flex flex-col gap-[6px] ${className}`}>
      {label && (
        <label className="font-[family-name:var(--font-body)] text-[13px] font-medium text-sl-700">
          {label}
          {required && <span className="text-danger ml-[2px]">*</span>}
        </label>
      )}

      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-sl-400 pointer-events-none">
            {leftIcon}
          </div>
        )}

        {isTextarea ? (
          <textarea
            {...sharedProps}
            rows={4}
            className={`${sharedProps.className} resize-y min-h-[100px]`}
          />
        ) : (
          <input type={type} {...sharedProps} />
        )}

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sl-500">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <span className="text-[12px] text-danger font-medium">⚠ {error}</span>
      )}
      {helperText && !error && (
        <span className="text-[12px] text-sl-400">{helperText}</span>
      )}
    </div>
  );
}
