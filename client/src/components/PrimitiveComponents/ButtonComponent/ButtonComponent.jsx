import React from "react";
import "./ButtonStyles.css";
import Spinner from "../Spinner/Spinner";

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
     {children} {loading ? <Spinner /> : null}
    </button>
  );
}
