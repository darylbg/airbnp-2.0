import React, { useRef, useEffect } from "react";
import WindowControlButton from "../WindowControlButton/WindowControlButton";

import "./DialogComponent.css";
export default function DialogComponent({
  className,
  openDialog,
  closeDialog,
  icon,
  dialogHeader,
  children,
}) {
  const dialogRef = useRef();

  useEffect(() => {
    if (openDialog) {
      dialogRef.current?.showModal();
      
    } else {
      dialogRef.current?.close();
    }
  }, [openDialog]);

  return (
    <dialog ref={dialogRef} onCancel={closeDialog} className={`dialog ${className} ${openDialog ? "dialog-open" : null}`}>
      <div className="dialog-content">
        <div className="dialog-header">
          <h4 className="text">{dialogHeader}</h4>
          <WindowControlButton action={closeDialog} icon={icon} />
        </div>
        <div className="dialog-body">{children}</div>
      
      </div>
    </dialog>
  );
}
