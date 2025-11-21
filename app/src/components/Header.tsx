"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav>
        <Link href="/">Public Dashboard</Link>
        <Link href="/dashboard">My Dashboard</Link>
        <Link href="/login">Login</Link>
      </nav>
    </header>
  );
}
