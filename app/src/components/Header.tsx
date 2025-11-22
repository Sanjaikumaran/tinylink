"use client";

import Link from "next/link";
const healthz = process.env.NEXT_PUBLIC_API_URL;

export default function Header() {
  return (
    <header data-testid="header">
      <nav data-testid="header-nav">
        <Link href="/" data-testid="dashboard-link">
          Dashboard
        </Link>
        <a
          href={`${healthz ?? ""}/healthz`}
          data-testid="health-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Health Check
        </a>
      </nav>
    </header>
  );
}
