import React from "react";
import "./ButtonStyles.css";

export default function ButtonComponent({
  className,
  children,
  action,
  type,
  loading,
}) {
  return (
    <button
      type={`${type}`}
      className={` ${className}`}
      onClick={action}
      disabled={loading}
    >
      {children}
    </button>
  );
}
