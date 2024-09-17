import React, { createContext, useEffect, useState } from "react";

// Create the context
const HelperFunctionsContext = createContext();

// Function to format the date from a timestamp
function formatDateFromTimestamp(timestamp) {
  // Convert the timestamp to milliseconds
  const date = new Date(parseInt(timestamp, 10));

  // Get the day, month, and year
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  // Format the date as DD-MM-YYYY
  return `${day}-${month}-${year}`;
}

// The HelperFunctionsProvider component
export const HelperFunctionsProvider = ({ children }) => {
  // State to store the current window size
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  // Update windowSize whenever the window is resized
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []); // Empty dependency array ensures this effect runs once when the component mounts

  return (
    <HelperFunctionsContext.Provider value={{ formatDateFromTimestamp, windowSize }}>
      {children}
    </HelperFunctionsContext.Provider>
  );
};

// Hook to use the HelperFunctionsContext
export const useHelperFunctions = () => React.useContext(HelperFunctionsContext);
