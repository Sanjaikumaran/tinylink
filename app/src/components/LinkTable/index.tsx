"use client";

import { useState } from "react";
import { LinkType } from "@/types/types";
import CustomTable from "../CustomTable";
import AddLinkForm from "../AddLinkForm";
import Link from "next/link";
import ConfirmModal from "../ConfirmModal";
import "./LinkTable.css";
import { formatDate } from "@/lib/utils";

export default function LinkTables({
  links,
  refresh,
  onDelete,
  loading,
}: {
  links: LinkType[];
  refresh: () => void;
  onDelete: (code: string) => void;
  loading: boolean;
}) {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const tableData = links.map((l) => ({
    code: l.code,
    target_url: l.target_url,
    total_clicks: l.total_clicks,
    tiny_url: `${process.env.NEXT_PUBLIC_BASE_URL}/${l.code}`,
    last_clicked: String(formatDate(new Date(l.last_clicked))),
    actions: (
      <div className="action-buttons">
        <button className="delete-btn" onClick={() => setDeleteTarget(l.code)}>
          Delete
        </button>
        <Link
          href={`/code/${l.code}`}
          className="stats-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          Stats
        </Link>
      </div>
    ),
  }));

  return (
    <>
      <CustomTable
        AddLinkForm={<AddLinkForm refresh={refresh} />}
        isLoading={loading}
        tableName="Tiny Link Table"
        columns={[
          { key: "code", label: "Code" },
          { key: "target_url", label: "Target Link" },
          { key: "tiny_url", label: "Tiny Link" },
          { key: "total_clicks", label: "Clicks" },
          { key: "last_clicked", label: "Last Clicked" },
          { key: "actions", label: "Actions" },
        ]}
        data={tableData}
      />

      <ConfirmModal
        open={deleteTarget !== null}
        message={`Are you sure you want to delete "${deleteTarget}"?`}
        onConfirm={() => {
          if (deleteTarget) onDelete(deleteTarget);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
