import { useRef, useEffect } from "react";

export function OTPDigitInput({ digits, onChange }) {
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    const newValue = value.slice(-1);
    if (newValue && !/^\d$/.test(newValue)) return;
    
    const newDigits = [...digits];
    newDigits[index] = newValue;
    onChange(newDigits);
    
    if (newValue && index < digits.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, digits.length);
    const pastedDigits = pastedData.split("");
    const newDigits = [...digits];
    
    pastedDigits.forEach((char, idx) => {
      if (idx < digits.length && /^\d$/.test(char)) {
        newDigits[idx] = char;
      }
    });
    
    onChange(newDigits);
    
    const nextEmptyIndex = newDigits.findIndex(d => !d);
    const focusIndex = nextEmptyIndex === -1 ? digits.length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-black focus:outline-none"
        />
      ))}
    </div>
  );
}