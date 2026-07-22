// src/pages/auth/ScLoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Button, AlertBanner } from "../../components/commons";
import { Shield } from "../../components/commons";
import { login } from "../../services/authService";

export default function ScLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Tous les champs sont obligatoires");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const response = await login(email, password);
      const user = response.user;
      if (user.role === "agent" || user.role === "service_client") {
        navigate("/service-client/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Identifiants incorrects");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl shadow-lg p-8">
        {/* Header SC */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ background: "var(--color-sidebar-sc, #3B1F5E)" }}
          >
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-sl-900)" }}>
            Service Client
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-sl-500)" }}>
            Espace réservé aux agents
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Email professionnel"
            type="email"
            placeholder="agent@serviloc.cm"
            value={email}
            onChange={(v) => { setEmail(v); setError(""); }}
            required
          />
          <Input
            label="Mot de passe"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(v) => { setPassword(v); setError(""); }}
            required
            rightIcon={
              <button onClick={() => setShowPassword(!showPassword)} type="button">
                {showPassword ? "🙈" : "👁"}
              </button>
            }
          />
        </div>

        {error && (
          <div className="mt-4">
            <AlertBanner type="danger" message={error} />
          </div>
        )}

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full mt-6"
        >
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </Button>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/auth/login")}
            className="text-sm hover:underline"
            style={{ color: "var(--color-brand)" }}
          >
            ← Espace client / prestataire
          </button>
        </div>
      </div>
    </div>
  );
}