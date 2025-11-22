"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import "./Toast.css";

type ToastType = "success" | "error" | "info";

interface ToastContextType {
  showToast: (msg: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(
    null
  );

  function showToast(msg: string, type: ToastType = "info") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div
          className={`toast toast-${toast.type}`}
          data-testid="toast-message"
          data-toast-type={toast.type}
        >
          {toast.msg}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx.showToast;
}
