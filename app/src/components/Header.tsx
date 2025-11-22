"use client";

import Link from "next/link";
const healthz = process.env.NEXT_PUBLIC_API_URL;

export default function Header() {
  return (
    <header>
      <nav>
        <Link href="/">Dashboard</Link>
        <a href={`${healthz ?? ""}/healthz`}>Health Check</a>
      </nav>
    </header>
  );
}
