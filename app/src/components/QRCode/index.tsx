"use client";

import { useRef } from "react";
import QRCode from "react-qr-code";

import "./QRCode.css";
import { downloadQR } from "@/lib/utils";
import { FaDownload } from "react-icons/fa";

export default function QRCodeGenerator({
  url,
  code,
}: {
  url: string;
  code: string;
}) {
  const qrRef = useRef<HTMLDivElement>(null);

  return (
    <div className="qr-section">
      <div
        id="qr-wrapper"
        ref={qrRef}
        style={{ background: "white", padding: 20 }}
      >
        <QRCode value={url} size={180} />
      </div>

      <button className="download-btn" onClick={() => downloadQR(code)}>
        Download QR <FaDownload />
      </button>
    </div>
  );
}
