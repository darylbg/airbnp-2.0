import React, { useRef, useEffect, useState } from "react";
import WindowControlButton from "../WindowControlButton/WindowControlButton";

import "./DialogComponent.css";
export default function DialogComponent({
  className,
  openDialog,
  closeDialog,
  icon,
  dialogHeader,
  backdropClosable,
  children,
}) {

  const dialogRef = useRef();
  const dialogBodyRef = useRef();

  useEffect(() => {
    if (openDialog) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [openDialog]);

  const findDialogOverlay = (e) => {
    if(e.target === dialogRef.current) {
      const isBackdropClosable = e.target.getAttribute("backdrop-closable") === "true";
      if (isBackdropClosable) {
        closeDialog();
      }
    } 
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={closeDialog}
      className={`dialog ${className} ${openDialog ? "dialog-open" : null}`}
      onClick={(e) => findDialogOverlay(e)}
      backdrop-closable={backdropClosable}
    >
      <div className="dialog-content">
        <div className="dialog-header">
          <h4 className="text">{dialogHeader}</h4>
          <WindowControlButton action={closeDialog} icon={icon} />
        </div>
        
        <div
          ref={dialogBodyRef}
          className="dialog-body scrollbar-1"
        >
          {children}
        </div>
      </div>
    </dialog>
  );
}
