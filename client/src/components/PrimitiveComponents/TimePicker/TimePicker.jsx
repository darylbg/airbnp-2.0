import React, { useState, useEffect } from "react";
import "./TimePicker.css";

export default function TimePicker({increment}) {
  const [time, setTime] = useState({
    hour: "",
    minute: ""
  });

  const [timeRemaining, setTimeRemaining] = useState({
    hours: 0,
    minutes: 0
  });

  console.log(timeRemaining);

  const handleTimePicker = () => {
    console.log("picked")
  }

  useEffect(() => {
    const now = new Date();

    // Extract the hours, minutes, and seconds from the new time
    const hours = now.getHours();
    const minutes = now.getMinutes();

    while(hours <= 24) {
        setTimeRemaining.hours(timeRemaining.hours + 1);
    }

    while(minutes <= 60) {
        setTimeRemaining.minutes(timeRemaining.minutes + 1);
    }


    // Format the time components to always be two digits
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    // const formattedSeconds = secs.toString().padStart(2, "0");

    // Combine the formatted time components into the desired format
    // setArrivalTime(`${formattedHours}:${formattedMinutes}`);
  }, []);

  return (
    <div className="time-picker">
      <div className="hour-selector"></div>
      <div className="minute-selector"></div>
    </div>
  );
}
