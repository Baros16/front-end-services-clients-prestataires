import { AlertBanner, Lock } from "../commons";
import { formatXAF } from "../../utils/formatters";

export default function SequestreInfo({ amount }) {
  return (
    <AlertBanner
      type="info"
      title={
        <span className="flex items-center gap-1">
          <Lock size={14} />
          Rappel séquestre
        </span>
      }
      message={`${formatXAF(amount)} séquestrés. Libération après double validation.`}
    />
  );
}