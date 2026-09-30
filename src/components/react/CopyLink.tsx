import { useState } from 'react';

interface Props {
  url: string;
  label?: string;
}

export default function CopyLink({ url, label = 'Copiar' }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt('Copia el enlace', url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded bg-[#eef2f0] px-[7px] py-1 font-mono text-[8px] text-[#3d584b] transition-colors hover:bg-[#dfe7e2]"
      aria-live="polite"
    >
      {copied ? 'COPIADO ✓' : label.toUpperCase()}
    </button>
  );
}
