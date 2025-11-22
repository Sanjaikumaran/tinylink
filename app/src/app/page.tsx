"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import LinkTable from "@/components/LinkTable";
import { LinkType } from "@/types/types";
import { ToastProvider } from "@/components/Toast";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<Array<LinkType>>([]);

  async function load() {
    const res = await api.get("/api/links");
    setLoading(false);
    setLinks(res.data as LinkType[]);
  }

  async function del(code: string) {
    await api.delete(`/api/links/${code}`);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div data-testid="dashboard-page">
      <ToastProvider>
        <h1 className="title" data-testid="dashboard-title">
          Tiny Link
        </h1>

        <LinkTable
          links={links}
          onDelete={del}
          refresh={load}
          loading={loading}
          data-testid="link-table"
        />
      </ToastProvider>
    </div>
  );
}
