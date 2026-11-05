import React from "react";
import { AlertCircle } from "lucide-react";

// A labelled text input with its error message underneath.
export default function Field({ id, label, value, onChange, error, className = "", inputRef, ...rest }) {
  const errorId = `${id}-error`;
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id}>{label}</label>
      <input
        ref={inputRef}
        id={id}
        name={id}
        type="text"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <p id={errorId} className="field-error">
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
