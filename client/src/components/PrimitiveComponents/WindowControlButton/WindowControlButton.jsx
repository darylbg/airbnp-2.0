import React from "react";
import "./WindowControlButton.css";

export default function WindowControlButton({ action, icon, className }) {
  const handleClick = (e) => {
    e.preventDefault();
    if(action) {
      action(e);
    }
  }
  return (
    <button className={`window-control-button ${className}`} onClick={handleClick}>
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
}
