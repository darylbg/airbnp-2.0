import React, { useEffect, useState, useRef } from "react";
import WindowControlButton from "../WindowControlButton/WindowControlButton";
import { useHelperFunctions } from "../../../HelperFunctions";
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
  tooltip,
}) {
  const [minimized, setMinimized] = useState(false);
  const {windowSize} = useHelperFunctions();

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
    if (minimize) {
      setMinimized(true);
    }
  };

  const handleMaximizeDialog = (e) => {
    if (minimize) {
      setMinimized(false);
    }
  };

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`dialog-backdrop ${
        dialogState ? "dialog-open" : "dialog-closed"
      }
        ${
          dialogState && minimized
            ? "dialog-backdrop-minimized"
            : "dialog-backdrop-maximized"
        }`}
      onClick={backdropClosable ? handleCloseDialog : null}
    >
      <div
        className={`dialog-content ${
          minimized ? "minimized-dialog-content" : className
        }`}
        onClick={handleContentClick}
      >
        <div
          className={`dialog-header ${
            minimized ? "dialog-header-minimized" : ""
          }`}
        >
          <div className="dialog-header-mobile">
            {windowSize < 769 && minimize && (
              <WindowControlButton
                action={minimized ? handleMaximizeDialog : handleMinimizeDialog}
                icon={windowSize < 769 ? (minimized ? "keyboard_arrow_up" : "keyboard_arrow_down") : (minimized ? "rectangle" : "remove")}
                tooltip={minimized ? "Expand" : "Minimize"}
              />
            )}
          </div>
          <h4 className="text">
            {dialogHeader}
            {minimized && "..."}
          </h4>
          <div className="dialog-header-btn-group">
            {windowSize > 768 && minimize && (
              <WindowControlButton
                action={minimized ? handleMaximizeDialog : handleMinimizeDialog}
                icon={minimized ? "rectangle" : "remove"}
                tooltip={minimized ? "Expand" : "Minimize"}
              />
            )}
            {icon && (
              <WindowControlButton
                tooltip={tooltip}
                action={handleCloseDialog}
                icon={icon}
              />
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
