"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function login() {
    try {
      await api.post("/api/auth/login", { email, password });
      router.push("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  }

  return (
    <div className="card">
      <h2>Login</h2>

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}
