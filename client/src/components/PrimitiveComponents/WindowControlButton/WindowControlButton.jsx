import React from "react";
import "./WindowControlButton.css";

export default function WindowControlButton({action, icon}) {
  return (
    <button className="window-control-button" onClick={action}>
      <span className="material-symbols-outlined">{icon}</span>
    </button>
  );
}
