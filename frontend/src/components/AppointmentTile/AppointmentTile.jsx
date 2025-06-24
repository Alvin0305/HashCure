import React from "react";
import "./appointmenttile.css";
import {
  cancelAppointmentsByUser,
  deleteAppointmentsByUser,
} from "../../services/appointmentService";
import { useUser } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import socket from "../../sockets/socket";

const AppointmentTile = ({ appointment, setAppointments }) => {
  const { user } = useUser();

  const handleDeleteAppointment = async (e) => {
    e.stopPropagation();
    try {
      const response = await deleteAppointmentsByUser(
        appointment.id,
        user.token
      );
      console.log(response.data);
      setAppointments((prev) => prev.filter((a) => a.id !== appointment.id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelAppointment = async (e) => {
    e.stopPropagation();
    socket.emit("cancel_appointment", appointment);
  };

  const navigate = useNavigate();
  const cancellable = ["Scheduled", "Pending"].includes(appointment.status);

  return (
    <div
      className="appointment-tile"
      onClick={() =>
        navigate("/patient/home/view-appointment", {
          state: { appointment: appointment },
        })
      }
    >
      <div className="appointent-tile-doctor-div">
        <h3 className="m0 appointment-tile-doctor">
          {appointment.doctor_name}
        </h3>
        <h3 className="m0 appointment-tile-fees">{"₹ " + appointment.fees}</h3>
      </div>
      <div className="appointment-tile-time-div">
        <h4 className="m0 appointment-tile-date">
          {new Date(appointment.time).toDateString()}
        </h4>
        <h4 className="m0 appointment-tile-time">
          {new Date(appointment.time).toLocaleTimeString("default", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </h4>
      </div>
      <h4 className="m0 appointment-tile-hospital">{appointment.hospital}</h4>
      <div className="appointment-tile-purpose-div">
        <h4 className="m0 appointment-tile-purpose">{appointment.purpose}</h4>
        <h2
          className={`m0 appointment-tile-status appointment-tile-${appointment.status.toLowerCase()}`}
        >
          {appointment.status}
        </h2>
      </div>
      <button
        className="appointment-tile-button"
        onClick={
          cancellable
            ? (e) => handleCancelAppointment(e)
            : (e) => handleDeleteAppointment(e)
        }
      >
        {cancellable ? "Cancel" : "Delete"}
      </button>
    </div>
  );
};

export default AppointmentTile;
