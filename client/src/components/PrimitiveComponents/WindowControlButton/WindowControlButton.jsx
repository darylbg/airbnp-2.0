import React from "react";
import "./WindowControlButton.css";

export default function WindowControlButton({action, icon, className}) {
  return (
    <button className={`window-control-button ${className}`} onClick={action}>
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
}
