import React, { useState } from "react";
import { AlertBanner } from "../../components/commons";
import { Input } from "../../components/commons";
import { Button } from "../../components/commons";
import { forgotPassword } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {

  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError("Email requis");
      return;
    }

    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email invalide. Format attendu nom@gmail.com");
      return;
    }

    setError("");
    setSuccess(false);
    setIsSubmitting(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
      setTimeout(() =>{
        navigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      },3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="w-full max-w-md  rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-2">Mot de passe oublie</h1>
          <p className="text-gray-500 mb-6">
            Saisissez votre email pour recevoir un code de reinitialisation
          </p>
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="vous@email.com"
              value={email}
              onChange={setEmail}
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
                message="Un code de renitialisation a ete envoye a votre email"
              />
            </div>
          )}
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full mt-6"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer le code "}
          </Button>
        </div>
      </div>
    </div>
  );
}
