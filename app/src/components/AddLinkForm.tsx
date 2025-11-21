"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function AddLinkForm({ refresh }: { refresh: () => void }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      await api.post("/api/links", { target_url: url, code });
      setUrl("");
      setCode("");
      refresh();
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed");
    }
    setLoading(false);
  }

  return (
    <div className="card">
      <h2>Create Short Link</h2>

      <input
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <input
        placeholder="Custom Code (optional)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button onClick={submit} disabled={loading}>
        {loading ? "Saving..." : "Create"}
      </button>
    </div>
  );
}
