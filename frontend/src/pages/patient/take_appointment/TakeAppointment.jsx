import React from "react";
import "./takeappointment.css";
import { useUser } from "../../../contexts/userContext";
import Calendar from "../../../utils/Calendar/Calendar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  createAppointment,
  getFixedAppointments,
} from "../../../services/appointmentService";
import { getDoctorWorkingHours } from "../../../services/doctorService";
import { toast } from "react-toastify";

const TakeAppointment = () => {
  const { user } = useUser();
  const location = useLocation();
  const { doctor } = location.state;

  const getStartOfWeek = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const [selectedWeek, setSelectedWeek] = useState(getStartOfWeek(new Date()));
  const [purpose, setPurpose] = useState("");
  const [fixedAppointments, setFixedAppointments] = useState({});
  const [availability, setAvailability] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const timeInterval = 20;
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user.token);
    console.log(selectedWeek);
    const fetchInitials = async () => {
      try {
        const localDateStr = selectedWeek.toLocaleDateString("en-CA");
        const [fixedAppointmentResponse, doctorAvailabilityResponse] =
          await Promise.all([
            getFixedAppointments(doctor?.id, localDateStr),
            getDoctorWorkingHours(doctor?.id),
          ]);
        setFixedAppointments(fixedAppointmentResponse.data);
        setAvailability(doctorAvailabilityResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitials();
  }, [doctor, selectedWeek]);

  const dayHeadings = [
    "",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const time = new Date();
  time.setHours(9, 0, 0, 0);

  const generateTimeSlots = (start = 9, end = 17, interval = 20) => {
    const slots = [];
    const current = new Date();
    current.setHours(start, 0, 0, 0);

    while (current.getHours() < end) {
      slots.push(new Date(current));
      current.setMinutes(current.getMinutes() + interval);
    }

    return slots;
  };

  const isPast = (slotTime) => {
    const now = new Date();
    return slotTime < now;
  };

  const isBooked = (slotTime, appointments) => {
    if (!appointments.length) return false;
    return appointments.some((app) => {
      const appTime = new Date(app.time);
      return (
        appTime.getHours() === slotTime.getHours() &&
        appTime.getMinutes() === slotTime.getMinutes()
      );
    });
  };

  const isAvailable = (day, slotTime) => {
    if (!availability[day]) return false;

    return availability[day].some((av) => {
      const dateStr = slotTime.toISOString().split("T")[0];
      const avStartTime = new Date(`${dateStr}T${av.start_time}`);
      const avEndTime = new Date(`${dateStr}T${av.end_time}`);

      return avStartTime <= slotTime && slotTime < avEndTime;
    });
  };

  const timeSlots = generateTimeSlots();

  const handleFixAppointment = async () => {
    if (!purpose.trim()) {
      toast.warn("Purpose should be mentioned");
      return;
    }
    if (!selectedSlot) {
      toast.warn("Select a slot");
      return;
    }

    console.log(selectedSlot);

    const appointmentData = {
      doctor_id: doctor.id,
      purpose,
      time: selectedSlot,
    };
    try {
      const response = await createAppointment(appointmentData, user.token);
      console.log(response.data);
      navigate("/patient/home");
    } catch (err) {
      console.err(err);
    }
  };

  const isSameSlot = (d1, d2) => {
    return (
      d1 &&
      d2 &&
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate() &&
      d1.getHours() === d2.getHours() &&
      d1.getMinutes() === d2.getMinutes()
    );
  };

  if (!doctor) return <div>Loading...</div>;

  return (
    <div className="take-appointment-page">
      <div className="take-appointment-top-div">
        <img
          src={doctor?.image}
          alt="Doctor"
          className="take-appointment-doctor-image"
        />
        <div className="take-appointment-top-subdiv">
          <div className="take-appointment-doctor-details">
            <h2 className="m0">{doctor.firstname}</h2>
            <h3 className="m0">{doctor.hospital_name}</h3>
          </div>
          <div className="take-appointment-fee-details">
            <h3 className="m0">{"₹ " + doctor.fees}</h3>
          </div>
        </div>
      </div>
      <textarea
        name="take-appointment-purpose"
        className="take-appointment-purpose"
        placeholder="Purpose..."
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
      ></textarea>
      <div className="take-appointment-legend">
        <div className="take-appointment-legend-subdiv">
          <div className="take-appointment-legend-content">
            <div className="take-appointment-legend-box take-appointment-legend-box-dark"></div>
            <h4 className="take-appointment-legend-value">Not Available</h4>
          </div>
          <div className="take-appointment-legend-content">
            <div className="take-appointment-legend-box take-appointment-legend-box-red"></div>
            <h4 className="take-appointment-legend-value">Already Scheduled</h4>
          </div>
        </div>
        <div className="take-appointment-legend-subdiv">
          <div className="take-appointment-legend-content">
            <div className="take-appointment-legend-box take-appointment-legend-box-dark-plus">
              <Icon icon="lucide:plus" width={24} height={24} />
            </div>
            <h4 className="take-appointment-legend-value">Doctor Available</h4>
          </div>
          <div className="take-appointment-legend-content">
            <div className="take-appointment-legend-box take-appointment-legend-box-green-plus">
              <Icon icon="lucide:plus" width={24} height={24} />
            </div>
            <h4 className="take-appointment-legend-value">Selected Schedule</h4>
          </div>
        </div>
      </div>
      <div className="take-appointment-calendar-button-div">
        <Calendar
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
        />
        <button
          className="take-appointment-button"
          onClick={handleFixAppointment}
        >
          Fix Appointment
        </button>
      </div>
      <div className="appointment-grid">
        <div className="header-cell" />
        {dayHeadings.slice(1).map((day) => (
          <div className="header-cell" key={day}>
            {day}
          </div>
        ))}
        {timeSlots.map((slotTime, rowIdx) => {
          return (
            <React.Fragment key={rowIdx}>
              <div className="time-label">
                {slotTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {dayHeadings.slice(1).map((day, colIdx) => {
                const date = new Date(selectedWeek);
                date.setDate(date.getDate() + colIdx);
                date.setHours(slotTime.getHours(), slotTime.getMinutes(), 0, 0);

                const booked = isBooked(date, fixedAppointments[day] || []);
                const available = isAvailable(day, date);
                const past = isPast(date);

                let className = "slot-cell";
                if (past || !available) className += " past";
                else if (booked) className += " booked";
                else if (selectedSlot && isSameSlot(selectedSlot, date)) {
                  className += " selected";
                  console.log("selected");
                } else className += " available";

                return (
                  <div
                    key={day + rowIdx}
                    className={className}
                    onClick={
                      className.includes("available")
                        ? () => {
                            setSelectedSlot(date);
                            console.log(date);
                          }
                        : () => {}
                    }
                  >
                    {className.includes("available") && (
                      <Icon icon="lucide:plus" width={32} height={32} />
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default TakeAppointment;
