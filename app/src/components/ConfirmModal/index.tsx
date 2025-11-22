"use client";
import "./ConfirmModal.css";

export default function ConfirmModal({
  open,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="confirm-modal">
        <p className="confirm-text">{message}</p>

        <div className="confirm-actions">
          <button className="confirm-btn delete" onClick={onConfirm}>
            Yes, Delete
          </button>

          <button className="confirm-btn cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
