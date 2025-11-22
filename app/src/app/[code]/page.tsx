"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function RedirectPage() {
  const { code } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRedirect() {
      try {
        const res = await api.get<{ target: string }>(`/${code}`);
        if (res.data?.target) {
          setTimeout(() => {
            window.location.href = res.data.target;
          }, 1000);
        } else {
          setError("Invalid code or target URL not found.");
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch redirect.");
        setLoading(false);
      }
    }

    fetchRedirect();
  }, [code]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        color: "#000000ff",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {loading && !error ? (
        <>
          <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>
            Redirecting Page...
          </h1>
          <p style={{ fontSize: "1rem", maxWidth: "400px" }}>
            Please wait while we take you to your destination.
          </p>
        </>
      ) : (
        <p style={{ fontSize: "1.2rem", color: "#ff6b6b" }}>{error}</p>
      )}
    </div>
  );
}
