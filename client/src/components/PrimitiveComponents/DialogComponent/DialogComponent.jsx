import React, { useRef, useEffect, useState } from "react";
import WindowControlButton from "../WindowControlButton/WindowControlButton";

import "./DialogComponent.css";
export default function DialogComponent({
  className,
  dialogState,
  closeDialog,
  icon,
  dialogHeader,
  backdropClosable,
  children,
}) {

  useEffect(() => {
    if (dialogState) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [dialogState])

  return (
    <div
      className={`dialog-backdrop ${
        dialogState ? "dialog-open" : "dialog-closed"
      }`}
      onClick={backdropClosable ? closeDialog : null}
    >
      <div className={`dialog-content ${className}`}>
        <div className="dialog-header">
          <h4 className="text">{dialogHeader}</h4>
          <WindowControlButton action={closeDialog} icon={icon} />
        </div>

        <div className="dialog-body scrollbar-1">
          {children}
        </div>
      </div>
    </div>
  );
}
