"use client";

import { useRef } from "react";
import QRCode from "react-qr-code";
import { FaDownload } from "react-icons/fa";
import "./QRCode.css";
import { downloadQR } from "@/lib/utils";

export default function QRCodeGenerator({
  url,
  code,
}: {
  url: string;
  code: string;
}) {
  const qrRef = useRef<HTMLDivElement>(null);

  return (
    <div className="qr-section" data-testid="qr-section">
      <div
        id="qr-wrapper"
        ref={qrRef}
        style={{ background: "white", padding: 20 }}
        data-testid="qr-wrapper"
      >
        <QRCode value={url} size={180} data-testid="qr-code" />
      </div>

      <button
        className="download-btn"
        onClick={() => downloadQR(code)}
        data-testid="download-btn"
      >
        Download QR <FaDownload />
      </button>
    </div>
  );
}
