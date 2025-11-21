"use client";

import { LinkType } from "@/types/types";
import Link from "next/link";

export default function LinkTablse({
  links,
  onDelete,
}: {
  links: LinkType[];
  onDelete: (code: string) => void;
}) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Code</th>
          <th>URL</th>
          <th>Clicks</th>
          <th>Last Clicked</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {links.map((l: any) => (
          <tr key={l.code}>
            <td>{l.code}</td>
            <td>{l.target_url}</td>
            <td>{l.total_clicks}</td>
            <td>{l.last_clicked || "-"}</td>
            <td>
              <button onClick={() => onDelete(l.code)} className="text-danger">
                Delete
              </button>

              <Link
                href={`/code/${l.code}`}
                className="text-link"
                style={{ marginLeft: 12 }}
              >
                Stats
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
