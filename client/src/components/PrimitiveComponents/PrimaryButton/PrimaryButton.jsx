import React from 'react';
import "./PrimaryButton.css";

export default function PrimaryButton({className, children, action}) {
  return (
    <button className={`primary-button ${className}`} onClick={action}>
      {children}
    </button>
  )
}
