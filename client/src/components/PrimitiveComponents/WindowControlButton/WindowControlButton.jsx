import React, { forwardRef } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import "./WindowControlButton.css";

export default function WindowControlButton({ action, icon, className, tooltip }) {
  const handleClick = (e) => {
    // console.log(e)
    e.preventDefault();
    if (action) {
      action(e);
    }
  };
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            className={`window-control-button ${className}`}
            onClick={handleClick}
          >
            <span className="material-symbols-outlined">{icon}</span>
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          {tooltip && <Tooltip.Content
            className="TooltipContent"
            sideOffset={5}
            avoidCollisions={true}
            collisionPadding={10}
          >
            {tooltip}
            <Tooltip.Arrow className="TooltipArrow" />
          </Tooltip.Content>}
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
