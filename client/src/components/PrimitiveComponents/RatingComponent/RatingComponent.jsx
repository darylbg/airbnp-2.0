import React from "react";
import "./RatingComponent.css";

export default function RatingComponent({ value, count }) {
  return (
    <div className="ratingComponent">
      <span class="star">&#9733;</span>
      <strong className="value">{parseInt(value).toFixed(1)}</strong>
      <div className="count">{`(${count > 0 ? count : "no reviews"})`}</div>
    </div>
  );
}
