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
  const [dialogScrolled, setDialogScrolled] = useState(false);

  const dialogRef = useRef();
  const dialogBodyRef = useRef();

  useEffect(() => {
    if (openDialog) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [openDialog]);

  useEffect(() => {
    const handleDialogScroll = (e) => {
      if (dialogBodyRef.current) {
        const dialogPosition = dialogBodyRef.current.scrollTop;
        return dialogPosition > 0
          ? setDialogScrolled(true)
          : setDialogScrolled(false);
      }
    };

    if (dialogBodyRef.current) {
      const dialogElement = dialogBodyRef.current;
      dialogElement.addEventListener("scroll", handleDialogScroll);
    }
    return () => {
      if (dialogBodyRef.current) {
        const dialogElement = dialogBodyRef.current;
        dialogElement.removeEventListener("scroll", handleDialogScroll);
      }
    };
  }, []);

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
        <div className={`dialog-header ${dialogScrolled ? "dialog-scrolled" : null}`}>
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
