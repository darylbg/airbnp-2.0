import React from 'react';
import "./PrimaryButton.css";

export default function PrimaryButton({className, children, action, type, loading}) {
  return (
    <button type={`${type}`} className={`primary-button ${className}`} onClick={action} disabled={loading}>
      {children}
    </button>
  )
}
