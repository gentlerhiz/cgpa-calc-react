import React, { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

// A small modal that asks before something is removed.
// Escape or the backdrop cancels, Tab stays inside, and focus goes back
// to whatever opened it (or to `fallbackFocus` if that is gone).
export default function ConfirmDialog({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel, fallbackFocus }) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);

  useEffect(() => {
    const opener = document.activeElement;
    const fallback = fallbackFocus?.current;
    cancelRef.current?.focus();
    return () => {
      const target = opener && document.body.contains(opener) ? opener : fallback;
      target?.focus();
    };
  }, [fallbackFocus]);

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onCancel();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = dialogRef.current.querySelectorAll("button");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div
        ref={dialogRef}
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        onKeyDown={onKeyDown}
      >
        <span className="modal-icon" aria-hidden="true">
          <AlertTriangle size={22} />
        </span>
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-message">{message}</p>
        <div className="modal-actions">
          <button ref={cancelRef} type="button" className="btn modal-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="btn modal-confirm" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
