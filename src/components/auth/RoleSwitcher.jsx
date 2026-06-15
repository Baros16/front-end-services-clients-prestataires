import { Button} from "../commons/Button";

export function RoleSwitcher({ role, onChange }) {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={role === "client" ? "primary" : "secondary"}
        onClick={() => onChange("client")}
        className="flex-1"
      >
        Client
      </Button>
      <Button
        variant={role === "provider" ? "primary" : "secondary"}
        onClick={() => onChange("provider")}
        className="flex-1"
      >
        Prestataire
      </Button>
    </div>
  );
}