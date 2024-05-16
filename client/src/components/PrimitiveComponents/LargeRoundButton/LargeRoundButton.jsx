import React from "react";

import "./LargeRoundButton.css";
export default function LargeRoundButton({ className, children, action }) {
  return (
    <button className={`large-round-button ${className}`} onClick={action}>
      {children}
    </button>
  );
}
