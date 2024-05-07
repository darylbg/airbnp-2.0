import React, { useRef, useEffect } from "react";
import WindowControlButton from "../WindowControlButton/WindowControlButton";

export default function DialogComponent({
  className,
  openDialog,
  closeDialog,
  icon,
  children,
}) {
  const ref = useRef();

  useEffect(() => {
    if (openDialog) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openDialog]);

  return (
    <dialog ref={ref} onCancel={closeDialog} className={className}>
      {children}
      <WindowControlButton action={closeDialog} icon={icon} />
    </dialog>
  );
}
