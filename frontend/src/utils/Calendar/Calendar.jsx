import React, { useState } from "react";
import { Icon } from "@iconify/react";
import "./calender.css";

const Calendar = ({ selectedWeek, setSelectedWeek }) => {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const moveToPreviousMonth = () => {
    if (selectedDay < new Date()) return;
    const newDate = new Date(selectedDay);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDay(newDate);
  };

  const moveToNextMonth = () => {
    if (selectedDay > new Date().setMonth(new Date().getMonth() + 4)) return;
    const newDate = new Date(selectedDay);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDay(newDate);
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const year = selectedDay.getFullYear();
  const month = selectedDay.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const numDays = lastDay.getDate();

  const startDay = firstDay.getDay();
  const calendarDays = [];

  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }

  for (let i = 1; i < numDays; i++) {
    calendarDays.push(i);
  }

  const handleClick = (day) => {
    const newDay = new Date(day);
    const dayOfWeek = newDay.getDay();
    newDay.setDate(newDay.getDate() - dayOfWeek);
    setSelectedWeek(newDay);
  };

  return (
    <div className="calendar">
      <div className="calendar-month-div">
        <Icon
          icon="lucide:chevron-left"
          height={24}
          width={24}
          onClick={moveToPreviousMonth}
          className="pointer"
        />
        <h3>
          {selectedDay.toLocaleDateString("default", {
            month: "short",
            year: "numeric",
          })}
        </h3>
        <Icon
          icon="lucide:chevron-right"
          height={24}
          width={24}
          onClick={moveToNextMonth}
          className="pointer"
        />
      </div>
      <div className="calendar-grid">
        {days.map((day) => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={index} className="calendar-day empty"></div>;
          }

          const fullDate = new Date(year, month, day);
          fullDate.setHours(0, 0, 0, 0); // normalize

          // Check if fullDate is within selectedWeek range (Sun - Sat)
          let isSelected = false;
          if (selectedWeek) {
            const start = new Date(selectedWeek);
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);

            if (fullDate >= start && fullDate <= end) {
              isSelected = true;
            }
          }

          return (
            <div
              key={index}
              className={`calendar-day pointer ${isSelected ? "selected" : ""}`}
              onClick={() => handleClick(fullDate)}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
