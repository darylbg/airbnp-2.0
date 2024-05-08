import React, { useRef, useEffect } from "react";
import WindowControlButton from "../WindowControlButton/WindowControlButton";

import "./DialogComponent.css";
export default function DialogComponent({
  className,
  openDialog,
  closeDialog,
  icon,
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
      {children}
      <WindowControlButton action={closeDialog} icon={icon} />
      </div>
    </dialog>
  );
}
