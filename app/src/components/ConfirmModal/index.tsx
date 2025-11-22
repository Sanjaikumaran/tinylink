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
    <div className="modal-overlay" data-testid="confirm-modal-overlay">
      <div className="confirm-modal" data-testid="confirm-modal">
        <p className="confirm-text" data-testid="confirm-message">
          {message}
        </p>

        <div className="confirm-actions" data-testid="confirm-actions">
          <button
            className="confirm-btn delete"
            onClick={onConfirm}
            data-testid="btn-confirm"
            data-label="delete-confirm"
          >
            Yes, Delete
          </button>

          <button
            className="confirm-btn cancel"
            onClick={onCancel}
            data-testid="btn-cancel"
            data-label="cancel-confirm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
