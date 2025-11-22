"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { FaCopy, FaLink, FaShare } from "react-icons/fa";
import "./stats.css";
import { useParams } from "next/navigation";
import {
  copyToClipboard,
  downloadQR,
  formatDate,
  shareLink,
} from "@/lib/utils";
import { ToastProvider, useToast } from "@/components/Toast";
import QRCodeGenerator from "@/components/QRCode";

function StatsComponent() {
  const showToast = useToast();
  const { code } = useParams();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const res = await api.get(`/api/links/${code}`);
      setData(res.data);
    } catch (e) {
      setData("ERROR");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading)
    return (
      <div className="stats-loading" data-testid="stats-loading">
        Loading…
      </div>
    );

  if (data === "ERROR")
    return (
      <div className="stats-error" data-testid="stats-error">
        Link not found!
      </div>
    );

  const fullURL = `${window.location.origin}/${data.code}`;

  return (
    <div className="stats-container" data-testid="stats-container">
      <h1 className="stats-title" data-label="stats-title">
        <FaLink /> Link Statistics
      </h1>

      <div className="stats-card" data-testid="stats-card">
        <div className="stats-row" data-label="short-code-row">
          <span className="stats-label">Short Code:</span>
          <span className="stats-value" data-testid="stats-short-code">
            {data.code}
          </span>
        </div>

        <div className="stats-row" data-label="target-url-row">
          <span className="stats-label">Target URL:</span>
          <span className="stats-value long-url" data-testid="stats-target-url">
            {data.target_url}
          </span>
        </div>

        <div className="stats-row" data-label="total-clicks-row">
          <span className="stats-label">Total Clicks:</span>
          <span className="stats-value" data-testid="stats-total-clicks">
            {data.total_clicks}
          </span>
        </div>

        <div className="stats-row" data-label="last-clicked-row">
          <span className="stats-label">Last Clicked:</span>
          <span className="stats-value" data-testid="stats-last-clicked">
            {formatDate(new Date(data.last_clicked)) || "-"}
          </span>
        </div>

        <QRCodeGenerator
          url={fullURL}
          code={data.code}
          data-testid="qr-section"
        />

        <div className="button-wrapper" data-testid="button-wrapper">
          <button
            className="copy-btn"
            data-testid="btn-copy-link"
            onClick={() => showToast(copyToClipboard(fullURL))}
          >
            Copy Link <FaCopy />
          </button>

          <button
            className="share-btn"
            data-testid="btn-share-link"
            onClick={() => showToast(shareLink(fullURL))}
          >
            <span>Share Link</span> <FaShare />
          </button>
        </div>

        <div className="short-url-box" data-label="short-url-box">
          <a href={fullURL} target="_blank" data-testid="stats-full-url">
            {fullURL}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function StatsPages() {
  return (
    <ToastProvider>
      <StatsComponent />
    </ToastProvider>
  );
}
