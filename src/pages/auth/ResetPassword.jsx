import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertBanner } from "../../components/commons";
import { Input } from "../../components/commons";
import { Button } from "../../components/commons";
import { OTPDigitInput } from "../../components/auth/OTPDigitInput";
import { resetPassword } from "../../services/authService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email =
    searchParams.get("email") || sessionStorage.getItem("pendingEmail");

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const codeString = code.join("");
    if (!email || !codeString || !newPassword || !confirmPassword) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email invalide. Format attendu nom@gmail.com");
      return;
    }

    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      await resetPassword(email, codeString, newPassword);
      setSuccess(true);
      sessionStorage.removeItem("pendingEmail");
      setTimeout(() => {
        navigate("/auth/login");
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md  rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2">Reinitialisation</h1>
        <p className="text-gray-500 mb-6">
          Saisissez le code recu et le nouveau mot de passe
        </p>

        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            disabled
            classname="bg-gray-100 cursor-not-allowed"
          />
          <div className="flex justify-center my-8">
            <OTPDigitInput digits={code} onChange={setCode} />
          </div>
          <Input
            label="Nouveau mot de passe"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={setNewPassword}
            required
          />
          <Input
            label="Confirmer le mot de passe"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
          />
        </div>

        {error && (
          <div className="mt-4">
            <AlertBanner type="danger" message={error} />
          </div>
        )}
        {success && (
          <div className="mt-4">
            <AlertBanner
              type="success"
              message="Mot de passe reinitialise avec succes. Redirection vers la page de connexion..."
            />
          </div>
        )}

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full mt-6"
        >
          {isSubmitting
            ? "Reinitialisation en cours..."
            : "Reinitialiser le mot de passe "}
        </Button>
      </div>
    </div>
  );
}
