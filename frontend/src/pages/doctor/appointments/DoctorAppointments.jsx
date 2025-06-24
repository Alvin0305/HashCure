import React, { useEffect, useState } from "react";
import "./doctorappointments.css";
import Bubble from "../../../components/Bubble";
import { getAppointmentsByDoctor } from "../../../services/appointmentService";
import { useUser } from "../../../contexts/userContext";
import socket from "../../../sockets/socket";
import DoctorAppointmentTile from "../../../components/DoctorAppointmentTile/DoctorAppointmentTile";

const DoctorAppointments = () => {
  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [appointments, setAppointments] = useState([]);

  const dayFilters = ["All", "Today", "Tomorrow", "Previous", "Upcoming"];
  const statusFilters = ["All", "Scheduled", "Cancelled", "Pending", "Past"];

  const { user } = useUser();

  useEffect(() => {
    const fetchInitials = async () => {
      try {
        const appointmentResponse = await getAppointmentsByDoctor(user.id, {});
        console.log(appointmentResponse.data);
        setAppointments(appointmentResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitials();
  }, []);

  useEffect(() => {
    const refetchAppointments = async () => {
      try {
        const filterData = {};

        if (selectedDay !== "All") {
          filterData["dayFilter"] = selectedDay;
        }
        if (selectedStatus !== "All") {
          filterData["statusFilter"] = selectedStatus;
        }
        const appointmentResponse = await getAppointmentsByDoctor(
          user.id,
          filterData
        );

        console.log(appointmentResponse.data);
        setAppointments(appointmentResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    refetchAppointments();
  }, [selectedDay, selectedStatus]);

  useEffect(() => {
    const handleCancelAppointment = ({ appointment }) => {
      console.log("appointment cancelled", appointment);
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointment.id ? { ...a, status: "Cancelled" } : a
        )
      );
    };

    const handleConfirmAppointment = ({ appointment, notification }) => {
      console.log("appointment confirmed", appointment);
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointment.id ? { ...a, status: "Scheduled" } : a
        )
      );
    };

    socket.on("appointment_cancelled", handleCancelAppointment);
    socket.on("appointment_confirmed", handleConfirmAppointment);

    return () => {
      socket.off("appointment_cancelled", handleCancelAppointment);
      socket.off("appointment_confirmed", handleConfirmAppointment);
    };
  }, []);

  return (
    <div className="patient-appoinments-page">
      <div className="patient-appointment-filter">
        {dayFilters.map((day, index) => (
          <Bubble
            key={index}
            name={day}
            selected={selectedDay === day}
            onClick={() => setSelectedDay(day)}
          />
        ))}
      </div>
      <div className="patient-appointment-filter">
        {statusFilters.map((status, index) => (
          <Bubble
            key={index}
            name={status}
            selected={selectedStatus === status}
            onClick={() => setSelectedStatus(status)}
          />
        ))}
      </div>
      <div className="patient-appointments-content">
        {appointments.map((appointment) => (
          <DoctorAppointmentTile
            key={appointment.id}
            appointment={appointment}
            setAppointments={setAppointments}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorAppointments;
