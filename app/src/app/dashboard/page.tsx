"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import LinkTable from "@/components/LinkTable";
import { LinkType } from "@/types/types";

export default function Dashboard() {
  const [links, setLinks] = useState<Array<LinkType>>([]);

  async function load() {
    try {
      const res = await api.get("/api/private/links");
      setLinks(res.data as LinkType[]);
    } catch {
      alert("Please login");
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function del(code: string) {
    await api.delete(`/api/private/links/${code}`);
    load();
  }

  return (
    <>
      <h2>My Links</h2>
      <LinkTable links={links} onDelete={del} />
    </>
  );
}
