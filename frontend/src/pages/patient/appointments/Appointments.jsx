import React, { useEffect, useState } from "react";
import "./appointments.css";
import Bubble from "../../../components/Bubble";
import { getAllHospitals } from "../../../services/hospitalService";
import { getDoctors } from "../../../services/doctorService";
import { getAppointmentsByUser } from "../../../services/appointmentService";
import { useUser } from "../../../contexts/userContext";
import AppointmentTile from "../../../components/AppointmentTile/AppointmentTile";

const Appointments = () => {
  const [selectedDay, setSelectedDay] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [hospitals, setHospitals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("Hospital...");
  const [selectedDoctor, setSelectedDoctor] = useState("Doctor...");
  const [appointments, setAppointments] = useState([]);

  const dayFilters = ["All", "Today", "Tomorrow", "Previous", "Upcoming"];
  const statusFilters = ["All", "Scheduled", "Cancelled", "Pending", "Past"];

  const { user } = useUser();

  useEffect(() => {
    const fetchInitials = async () => {
      try {
        const [hospitalResponse, doctorResponse, appointmentResponse] =
          await Promise.all([
            getAllHospitals({}),
            getDoctors({}),
            getAppointmentsByUser(user.id, {}),
          ]);
        console.log(appointmentResponse.data);
        setHospitals(hospitalResponse.data);
        setDoctors(doctorResponse.data);
        setAppointments(appointmentResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitials();
  }, []);

  useEffect(() => {
    const refetchDoctors = async () => {
      try {
        const filterData = {};
        console.log(selectedHospital);
        if (selectedHospital !== "Hospital...") {
          filterData["hospitalName"] = selectedHospital;
        }
        const doctorResponse = await getDoctors(filterData);

        console.log(doctorResponse.data);
        setDoctors(doctorResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    refetchDoctors();
  }, [selectedHospital]);

  useEffect(() => {
    const refetchAppointments = async () => {
      try {
        const filterData = {};
        console.log(selectedHospital);
        if (selectedHospital !== "Hospital...") {
          filterData["hospital"] = selectedHospital;
        }
        if (selectedDoctor !== "Doctor...") {
          filterData["doctor_firstname"] = selectedDoctor.split(" ")[0];
          filterData["doctor_lastname"] = selectedDoctor.split(" ")[1];
        }
        if (selectedDay !== "All") {
          filterData["dayFilter"] = selectedDay;
        }
        if (selectedStatus !== "All") {
          filterData["statusFilter"] = selectedStatus;
        }
        const appointmentResponse = await getAppointmentsByUser(
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
  }, [selectedDay, selectedStatus, selectedHospital, selectedDoctor]);

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
      <div className="patient-appointment-filter">
        <select
          className="drop-down"
          name="hospital"
          value={selectedHospital}
          onChange={(e) => setSelectedHospital(e.target.value)}
        >
          <option value="Hospital...">Hospital...</option>
          {hospitals.map((hospital, index) => (
            <option value={hospital.name} key={index}>
              {hospital.name}
            </option>
          ))}
        </select>
        <select
          className="drop-down"
          name="doctor"
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
        >
          <option value="Doctor...">Doctor...</option>
          {doctors.map((doctor, index) => (
            <option
              value={doctor.firstname + " " + doctor.lastname}
              key={index}
            >
              {doctor.firstname + " " + doctor.lastname}
            </option>
          ))}
        </select>
      </div>
      <div className="patient-appointments-content">
        {appointments.map((appointment) => (
          <AppointmentTile
            key={appointment.id}
            appointment={appointment}
            setAppointments={setAppointments}
          />
        ))}
      </div>
    </div>
  );
};

export default Appointments;
