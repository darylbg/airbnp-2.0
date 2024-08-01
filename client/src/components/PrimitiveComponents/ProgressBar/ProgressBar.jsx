import React, { useState, useEffect, useRef } from "react";
import "./ProgressBar.css";

export default function StepProgressBar({
  progressSteps,
  currentStep,
  className,
}) {
  const [stepHeight, setStepHeight] = useState(0);
  const [stepWidths, setStepWidths] = useState({
    firstStep: 0,
    lastStep: 0,
  });
  const [numberHeight, setNumberHeight] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const stepRefs = useRef([]);
  const numberRefs = useRef([]);

  // console.log(numberHeight)
  useEffect(() => {
    // calculate average width of step elements
    const stepHeights = stepRefs.current.map((ref) => ref?.offsetHeight || 0);
    const stepWidths = stepRefs.current.map((ref) => ref?.offsetWidth || 0);
    setStepHeight(Math.max(...stepHeights));
    setStepWidths({
      firstStep: stepWidths[0],
      lastStep: stepWidths[stepWidths.length - 1],
    });

    // calculate average step numbers height elements
    const numberHeights = numberRefs.current.map(
      (ref) => ref?.offsetHeight || 0,
    );
    setNumberHeight(Math.max(...numberHeights));
    calculateProgressPercentage(progressSteps, currentStep);
  }, [progressSteps, currentStep]);

  const totalSteps = progressSteps.length;

  // calculate percentage of way through array assuming index[0] = 0%
  const calculateProgressPercentage = (progressSteps, currentStep) => {
    if (progressSteps.length <= 1) {
      console.log("array cannot be empty");
      return;
    }

    const index = progressSteps.findIndex(
      (item) => Object.keys(item)[0] == currentStep,
    );

    if (index === -1) {
      console.log("Item not found in the array");
      return;
    }

    const percentage = (index / (progressSteps.length - 1)) * 100;
    setProgressPercentage(percentage);
  };

  return (
    <div
      className={`step-progress-bar ${className}`}
      style={{ height: `${stepHeight}px` }}
    >
      <div
        className="bar-wrapper"
        style={{
          left: `${stepWidths.firstStep / 2}px`,
          right: `${stepWidths.lastStep / 2}px`,
        }}
      >
        <div className="bar" style={{ top: `${numberHeight / 2}px` }}>
          <div
            className="bar-highlight"
            style={{
              width: `${progressPercentage}%`,
            }}
          ></div>
        </div>
        {progressSteps.map((step, index) => {
          const stepCaption = step[index + 1];
          const position = (index / (totalSteps - 1)) * 100;

          return (
            <div
              key={index}
              className={`step ${
                index + 1 < currentStep
                  ? "step-completed"
                  : index + 1 === currentStep
                  ? "step-current"
                  : ""
              }`}
              style={{ left: `${position}%` }}
              ref={(el) => (stepRefs.current[index] = el)}
            >
              <div
                className="step-number"
                ref={(el) => (numberRefs.current[index] = el)}
              >
                {index + 1}
              </div>
              <div className="step-caption">{stepCaption}</div>
            </div>
          );
        })}
      </div>
      <div className="bar-progress-indicator"></div>
    </div>
  );
}
