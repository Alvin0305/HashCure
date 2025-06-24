import "./tile.css";
import { deleteAppointmentsByUser } from "../../services/appointmentService";
import { useUser } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import socket from "../../sockets/socket";
import { useEffect, useState } from "react";
import { getUserById } from "../../services/userService";

const DoctorAppointmentTile = ({ appointment, setAppointments }) => {
  const { user } = useUser();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(appointment.patient_id);
        setPatient(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

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

  const handleAcceptAppointment = (e) => {
    e.stopPropagation();
    socket.emit("confirm_appointment", appointment);
  };

  const navigate = useNavigate();
  const deletable = ["Past", "Cancelled"].includes(appointment.status);

  return (
    <div
      className="appointment-tile"
      onClick={() =>
        navigate("/doctor/home/conduct-appointment", {
          state: { appointment: appointment },
        })
      }
    >
      <div className="appointent-tile-doctor-div">
        <h3 className="m0 appointment-tile-doctor">{patient?.firstname}</h3>
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
      {deletable ? (
        <button
          className="appointment-tile-button"
          onClick={(e) => handleDeleteAppointment(e)}
        >
          Delete
        </button>
      ) : appointment.status === "Scheduled" ? (
        <div className="gap-10 flex mt-10">
          <button
            className="appointment-tile-button"
            onClick={(e) => handleCancelAppointment(e)}
          >
            Cancel
          </button>
          <button
            className="appointment-tile-button consult-button"
            onClick={(e) => handleConsultAppointment(e)}
          >
            Consult
          </button>
        </div>
      ) : (
        <div className="flex gap-10">
          <button
            className="appointment-tile-button accept-button"
            onClick={(e) => handleAcceptAppointment(e)}
          >
            Accept
          </button>
          <button
            className="appointment-tile-button"
            onClick={(e) => handleCancelAppointment(e)}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentTile;
