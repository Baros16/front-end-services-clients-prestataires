import { Button } from '../commons';

export function ContactClientButton() {
  return (
    <div className="bg-white border border-sl-100 rounded-xl p-4 space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-sl-400">Client</p>
      <Button variant="secondary" className="w-full">💬 Contacter le client</Button>
    </div>
  );
}
