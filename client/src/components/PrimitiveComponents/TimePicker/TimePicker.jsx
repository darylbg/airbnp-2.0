import React, { useState, useEffect, useRef } from "react";
import "./TimePicker.css";

export default function TimePicker({ setArrivalTime, arrivalTime }) {
  const [selectedTime, setSelectedTime] = useState({
    hour: "",
    minute: "",
  });
  const [pickerHeight, setPickerHeight] = useState(0);
  const hourRefs = useRef([]);
  const minuteSectionRef = useRef(null);
  console.log("arrival time",arrivalTime);
  // console.log("selected time",selectedTime);
  useEffect(() => {
    const currentTime = new Date();
    setSelectedTime((prev) => ({ ...prev, hour: currentTime.getHours() }));

    // console.log(minuteSectionRef.current);
    if (minuteSectionRef.current) {
      setPickerHeight(minuteSectionRef.current.offsetHeight);
    }

    // Scroll to the first non-disabled hour button
    const firstAvailableHourRef = hourRefs.current.find(
      (ref) => ref && !ref.disabled
    );
    if (firstAvailableHourRef) {
      firstAvailableHourRef.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, []);

  const renderHours = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(
        <button
          key={i}
          className={`hour ${i === arrivalTime?.hour ? "selected-time" : ""}`}
          disabled={
            i < currentHour || (i === currentHour && currentMinute > 50)
          }
          onClick={() => {
            setSelectedTime((prev) => ({
              ...prev,
              hour: i < 10 ? `0${i}` : i,
            }));
            setArrivalTime((prev) => ({ ...prev, hour: i < 10 ? `0${i}` : i }));
          }}
          ref={(el) => (hourRefs.current[i] = el)}
        >
          {i < 10 ? `0${i}` : i}
        </button>
      );
    }
    return hours;
  };

  const renderMinutes = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    const minutes = [];
    for (let i = 0; i < 60; i += 10) {
      let isDisabled = false;
      if (selectedTime.hour === currentHour && i <= currentMinute) {
        isDisabled = true;
      }

      minutes.push(
        <button
          key={i}
          className={`minute ${
            i === arrivalTime?.minute ? "selected-time" : ""
          }`}
          disabled={isDisabled}
          onClick={() => {
            setArrivalTime((prev) => ({
              ...prev,
              minute: i < 10 ? `0${i}` : i,
            }));
            setSelectedTime((prev) => ({
              ...prev,
              minute: i < 10 ? `0${i}` : i,
            }));
          }}
        >
          {i < 10 ? `0${i}` : i}
        </button>
      );
    }
    return minutes;
  };

  return (
    <div className="time-picker">
      <div className="hour-section" style={{ height: pickerHeight }}>
        <span className="heading">hours</span>
        <div className="hours">{renderHours()}</div>
      </div>
      <div className="minute-section" ref={minuteSectionRef}>
        <span className="heading">minutes</span>
        <div className="minutes">{renderMinutes()}</div>
      </div>
    </div>
  );
}
