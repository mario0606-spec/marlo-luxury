import QRCode from "qrcode";

interface CertificateQRProps {
  url: string;
  label: string;
}

export async function CertificateQR({ url, label }: CertificateQRProps) {
  const svg = await QRCode.toString(url, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    color: { dark: "#1c1917", light: "#ffffff00" },
  });

  return (
    <a
      href={url}
      aria-label={label}
      className="certificate-qr inline-flex flex-col items-center"
    >
      <div
        className="w-24 h-24 sm:w-28 sm:h-28 bg-white border border-stone-200 p-1"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <span className="text-[10px] tracking-[0.2em] uppercase text-stone-500 mt-2 text-center">
        Scannen zum Verifizieren
      </span>
      <span className="text-[10px] text-stone-400 font-mono break-all max-w-[7rem] mx-auto mt-1 text-center">
        {url}
      </span>
    </a>
  );
}
