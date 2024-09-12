import React, { createContext } from "react";

const HelperFunctionsContext = createContext();

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

export const HelperFunctionsProvider = ({ children }) => {
  return (
    <HelperFunctionsContext.Provider value={{formatDateFromTimestamp}}>
      {children}
    </HelperFunctionsContext.Provider>
  );
};

export const useHelperFunctions = () => React.useContext(HelperFunctionsContext);
