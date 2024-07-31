import React from "react";
import "./ProgressBar.css";

export default function StepProgressBar({
  progressSteps,
  currentStep,
  className,
}) {
    const totalSteps = progressSteps.length;
  return (
    <div className="step-progress-bar">
      {progressSteps.map((step, index) => {
        const stepNumber = Object.keys(step)[0];
        const stepCaption = step[stepNumber];
        const position = (index / (totalSteps - 1)) * 100;
        return (
          <div key={index} className="step" style={{ left: `${position}%` }}>
            <div className="step-number">{stepNumber}</div>
            <div className="step-caption">{stepCaption}</div>
          </div>
        );
      })}
    </div>
  );
}
