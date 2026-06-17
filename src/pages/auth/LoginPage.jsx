import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoleSwitcher } from "../../components/auth/RoleSwitcher";
import { Input } from "../../components/commons/Input";
import { Button } from "../../components/commons/Button";
import { AlertBanner } from "../../components/commons/AlertBanner";
import { login } from "../../services/authService";

export default function LoginPage() {
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

    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email invalide. Format attendu nom@gmail.com");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await login(email, password);

      localStorage.setItem("serviloc_access", response.accessToken);
      localStorage.setItem("serviloc_refresh", response.refreshToken);
      localStorage.setItem(
        "sl_mock_user",
        JSON.stringify({ role: response.user.role.toUpperCase() }),
      );

      const role = response.user.role;

      if (role === "client") navigate(`/client/dashboard`);
      else if (role === "provider") navigate("/provider/dashboard");
      else navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md  rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2">Connexion</h1>
        <p className="text-gray-500 mb-6">Acceder a votre compte</p>

        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="vous@email.com"
            value={email}
            onChange={setEmail}
            required
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            required
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
          {isSubmitting ? "Connexion en cours..." : "Se connecter"}
        </Button>

        <div className="text-center mt-4">
          <span className="text-gray-500">Pas inscrit ? </span>
          <button
            onClick={() => navigate("/auth/register")}
            className="text-black underline font-medium"
          >
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
}
