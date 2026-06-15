import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/commons/Input";
import { Button } from "../../components/commons/Button";
import { AlertBanner } from "../../components/commons/AlertBanner";
import { RoleSwitcher } from "../../components/auth/RoleSwitcher";
import { register } from "../../services/authService.js";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [role, setRole] = useState("client");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.email ||
      !formData.password
    ) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    // Vérification email
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Email invalide. Format attendu nom@gmail.com");
      return;
    }

    // Vérification téléphone (+237 suivi de 9 chiffres)
    const phoneRegex = /^\+237[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Téléphone invalide. Format attendu: +237XXXXXXXXX");
      return;
    }

    // Vérification mot de passe (minimum 6 caractères)
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    // Vérification prénom et nom (minimum 2 caractères)
    if (formData.firstName.length < 4 || formData.lastName.length < 4) {
      setError("Le prénom et le nom doivent contenir au moins 4 caractères");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const payload = {
        role,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      };

      const response = await register(payload);

      sessionStorage.setItem("pendingUserId", response.userId);
      sessionStorage.setItem("pendingPhone", formData.phone);

      navigate(`/auth/otp?userId=${response.userId}`);
    } catch (err) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md  rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-2">Créer un compte</h1>
        <p className="text-gray-500 mb-6">
          Commencez gratuitement dès aujourd'hui
        </p>

        <RoleSwitcher role={role} onChange={setRole} />

        <div className="space-y-4">
          <Input
            label="Prénom"
            placeholder="Ex: Madeleine"
            value={formData.firstName}
            onChange={(value) => handleChange("firstName", value)}
            required
          />
          <Input
            label="Nom"
            placeholder="Ex: Kamdem"
            value={formData.lastName}
            onChange={(value) => handleChange("lastName", value)}
            required
          />
          <Input
            label="Téléphone"
            type="tel"
            placeholder="+2376XXXXXXXX"
            value={formData.phone}
            onChange={(value) => handleChange("phone", value)}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="vous@email.com"
            value={formData.email}
            onChange={(value) => handleChange("email", value)}
            required
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(value) => handleChange("password", value)}
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
          {isSubmitting ? "Création en cours..." : "Créer mon compte"}
        </Button>

        <div className="text-center mt-4">
          <span className="text-gray-500">Déjà inscrit ? </span>
          <button
            onClick={() => navigate("/auth/login")}
            className="text-black underline font-medium"
          >
            Se connecter
          </button>
        </div>

        <div className="mt-4">
          <AlertBanner
            type="info"
            message="Un code SMS vous sera envoyé pour valider votre numéro de téléphone."
          />
        </div>
      </div>
    </div>
  );
}
