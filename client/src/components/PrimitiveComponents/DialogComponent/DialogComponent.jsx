import React, { useEffect } from "react";
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
  }, [dialogState]);

  const handleCloseDialog = (e) => {
    if (closeDialog) {
      closeDialog(e);
    }
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`dialog-backdrop ${dialogState ? "dialog-open" : "dialog-closed"}`}
      onClick={backdropClosable ? handleCloseDialog : null}
    >
      <div className={`dialog-content ${className}`} onClick={handleContentClick}>
        <div className="dialog-header">
          <h4 className="text">{dialogHeader}</h4>
          {icon && <WindowControlButton action={handleCloseDialog} icon={icon} />}
        </div>
        <div className="dialog-body scrollbar-1">
          {children}
        </div>
      </div>
    </div>
  );
}
