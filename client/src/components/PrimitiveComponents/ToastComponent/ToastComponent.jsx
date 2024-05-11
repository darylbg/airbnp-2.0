import React from "react";
import toast from "react-hot-toast";
import WindowControlButton from "../WindowControlButton/WindowControlButton";

import "./ToastComponent.css";

export default function ToastComponent({ message }) {
  return (
    <span className="toast-span">
      {message}
      <WindowControlButton action={() => toast.dismiss()} icon="close" />
    </span>
  );
}
