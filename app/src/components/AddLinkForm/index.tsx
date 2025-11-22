"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/Toast";
import "./AddLinkForm.css";
import QRCodeGenerator from "../QRCode";
import { copyToClipboard, shareLink } from "@/lib/utils";
import { FaCopy, FaShare } from "react-icons/fa";

export default function AddLinkForm({ refresh }: { refresh: () => void }) {
  const showToast = useToast();
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [shortLink, setShortLink] = useState("");
  const [locked, setLocked] = useState(false);

  async function submit() {
    if (available === false) {
      showToast("Custom code is already taken!", "error");
      return;
    }

    if (!url.trim()) {
      showToast("Enter a URL to shorten", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<{ code: string }>("/api/links", {
        target_url: url,
        code,
      });
      const generated = `${window.location.origin}/${res.data.code}`;

      setShortLink(generated);
      setLocked(true);
      refresh();
      showToast("Short link created!", "success");
    } catch (error: any) {
      showToast(error.response?.data?.error || "Failed", "error");
    }
    setLoading(false);
  }

  function resetForm() {
    setUrl("");
    setCode("");
    setShortLink("");
    setAvailable(null);
    setLocked(false);
    showToast("Ready to create another link", "info");
  }
  return (
    <div className="card">
      <h2 className="modal-title">Create a Short Link</h2>

      <div className="modal-content">
        {!shortLink && (
          <p className="modal-desc">
            Generate a short, easy-to-share link for any long URL.
          </p>
        )}
        {!locked && (
          <>
            <label className="modal-label">Destination URL</label>
            <input
              disabled={locked}
              className="modal-input"
              placeholder="https://your-long-url.com/page"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <label className="modal-label">Custom Code (Optional)</label>

            <input
              disabled={locked}
              className="modal-input"
              placeholder="my-custom-code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setAvailable(null);
              }}
            />

            {available === true && (
              <div className="available-msg">✔ Code available</div>
            )}
            {available === false && (
              <div className="error">✖ Code already taken</div>
            )}

            <button
              className="modal-btn"
              onClick={submit}
              disabled={loading || Boolean(code && available === false)}
            >
              {loading ? "Loading..." : "Generate Link"}
            </button>
          </>
        )}

        {shortLink && (
          <>
            <div className="generated-box">
              <h3>Your Short Link</h3>
              <div className="short-url-box generated-link">
                <a href={shortLink} target="_blank">
                  {shortLink}
                </a>
              </div>

              <QRCodeGenerator url={shortLink} code={code} />

              <div className="generated-actions">
                <div className="button-wrapper">
                  <button
                    className="copy-btn"
                    onClick={() => showToast(copyToClipboard(shortLink))}
                  >
                    Copy Link <FaCopy />
                  </button>
                  <button
                    className="share-btn"
                    onClick={() => showToast(shareLink(shortLink))}
                  >
                    Share Link <FaShare />
                  </button>
                </div>
                <button className="reset-btn" onClick={resetForm}>
                  Create Another Link
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
