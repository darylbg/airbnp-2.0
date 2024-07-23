import React, { useEffect, useState } from "react";
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
  minimize,
}) {
  const [minimized, setMinimized] = useState(false);
  useEffect(() => {
    if (dialogState) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [dialogState]);

  const handleCloseDialog = (e) => {
    // e.stopPropagation();
    if (closeDialog) {
      console.log("closed", e);
      setMinimized(false);
      closeDialog(e);
    }
  };

  const handleMinimizeDialog = (e) => {
    // e.stopPropagation();
    if (minimize) {
      setMinimized(true);
      console.log("minimized");
    }
  };

  const handleMaximizeDialog = (e) => {
    // e.stopPropagation();
    if (minimize) {
      setMinimized(false);
      console.log("maximized");
    }
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`dialog-backdrop ${
        dialogState ? "dialog-open" : "dialog-closed"}
        ${dialogState && minimized ? "dialog-backdrop-minimized" : "dialog-backdrop-maximized"
      }`}
      onClick={backdropClosable ? handleCloseDialog : null}
    >
      <div
        className={`dialog-content ${minimized? "minimized-dialog-content" : className}`}
        onClick={handleContentClick}
      >
        <div className={`dialog-header ${minimized? "dialog-header-minimized" : ""}`}>
          <div className="dialog-header-spacer"></div>
          <h4 className="text">{dialogHeader}</h4>
          <div className="dialog-header-btn-group">
            {minimize && (
              <WindowControlButton
                action={minimized ? handleMaximizeDialog : handleMinimizeDialog}
                icon={minimized ? "rectangle" : "remove"}
              />
            )}
            {icon && (
              <WindowControlButton action={handleCloseDialog} icon={icon} />
            )}
          </div>
        </div>
        <div
          className={`dialog-body scrollbar-1 
            ${minimized ? "dialog-body-minimized" : ""}
        `}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
