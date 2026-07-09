import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/commons/Button";
import { AlertBanner } from "../../components/commons/AlertBanner";
import { OTPDigitInput } from "../../components/auth/OTPDigitInput";
import { Mail } from "../../components/commons/Icons";
import { verifyOtp, resendOtp } from "../../services/authService";

export default function OTPVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || sessionStorage.getItem("pendingEmail");

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(45);
  const [canResend, setCanResend] = useState(false);

  const otpCode = digits.join("");

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    const isComplete = digits.every(d => d !== "");
    if (isComplete && !isSubmitting) {
      handleSubmit();
    }
  }, [digits]);

  const handleSubmit = async () => {
    if (!email) {
      setError("Email manquant. Veuillez recommencer l'inscription.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await verifyOtp(email, otpCode);
      const message = response?.data?.message ?? response?.message ?? "Compte activé avec succès !";
      setSuccess(message);
      
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (err) {
      const errorCode = err.code;
      if (errorCode === "INVALID_OTP") {
        setError(`Code incorrect — ${err.attemptsRemaining || 2} tentative(s) restante(s)`);
        setDigits(["", "", "", "", "", ""]);
      } else if (errorCode === "OTP_EXPIRED") {
        setError("Code expiré. Cliquez sur 'Renvoyer'.");
      } else if (errorCode === "OTP_MAX_ATTEMPTS") {
        setError("Trop de tentatives. Compte bloqué 15 minutes.");
      } else {
        setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email manquant. Veuillez recommencer l'inscription.");
      return;
    }

    setCanResend(false);
    setCountdown(45);
    setError("");
    setSuccess("");
    setDigits(["", "", "", "", "", ""]);

    try {
      // ✅ Nouvelle signature : resendOtp(email)
      await resendOtp(email);
    } catch (err) {
      setError(err.message || "Impossible de renvoyer le code. Réessayez.");
      setCanResend(true);
    }
  };

  const formatPhone = (phone) => {
    if (!phone) return "+237 XXX XXX XXX";
    return phone.slice(0, 13);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-2">
          <Mail size={36} className="text-sl-500" />
        </div>
        {/* Titre et sous-titre centrés */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Vérification du téléphone</h1>
          <p className="text-gray-500">
            Code envoyé au {formatPhone(sessionStorage.getItem("pendingPhone"))}
          </p>
        </div>

        {/* Inputs OTP centrés */}
        <div className="flex justify-center my-8">
          <OTPDigitInput digits={digits} onChange={setDigits} />
        </div>

        {/* Message d'erreur avec icône */}
        {error && (
          <div className="mt-4">
            <AlertBanner type="danger" message={error} />
          </div>
        )}

        {success && (
          <div className="mt-4">
            <AlertBanner type="success" message={success} />
          </div>
        )}

        {/* Bouton de validation */}
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full mt-6"
        >
          {isSubmitting ? "Vérification..." : "Valider le code"}
        </Button>

        {/* Timer et renvoi */}
        <div className="text-center mt-4">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-black underline font-medium"
            >
              Renvoyer le code
            </button>
          ) : (
            <span className="text-gray-400">
              Renvoyer dans {Math.floor(countdown / 60)}:
              {(countdown % 60).toString().padStart(2, "0")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
