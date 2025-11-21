"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LinkType } from "@/types/types";

export default function CodePage({ params }: { params: { code: string } }) {
  const [data, setData] = useState<LinkType>();

  useEffect(() => {
    api
      .get<LinkType>(`/api/links/${params.code}`)
      .then((res) => setData(res.data));
  }, [params.code]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="card">
      <h2>{data.code} — Stats</h2>
      <p>
        <strong>Target:</strong> {data.target_url}
      </p>
      <p>
        <strong>Clicks:</strong> {data.total_clicks}
      </p>
      <p>
        <strong>Last Clicked:</strong> {data.last_clicked || "Never"}
      </p>
      <p>
        <strong>Created:</strong> {data.created_at}
      </p>
    </div>
  );
}
