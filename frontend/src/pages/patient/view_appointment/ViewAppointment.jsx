import React from "react";
import { useLocation } from "react-router-dom";
import "./viewappointment.css";
import { generateAppointmentPDF } from "../../../utils/util";

const ViewAppointment = () => {
  const location = useLocation();
  const { appointment } = location.state;

  const handlePrint = () => {
    generateAppointmentPDF(appointment);
  };

  return (
    <div className="view-appointment-page">
      <div className="view-appointment-page-top">
        <div className="view-appointment-page-top-left">
          <h2 className="m0">{appointment.doctor_name}</h2>
          <h4 className="m0">{new Date(appointment.time).toDateString()}</h4>
          <h3 className="m0">{appointment.hospital_name}</h3>
        </div>
        <div className="view-appointment-page-top-right">
          <h3 className="m0">{"₹ " + appointment.fees}</h3>
          <h4 className="m0">
            {new Date(appointment.time).toLocaleTimeString("default", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </h4>
        </div>
      </div>
      <div className="view-appointment-content">
        <h2>Chief Complaint</h2>
        <h4 className="m0">{appointment.chief_complaint}</h4>
        <h2>Diagnosis</h2>
        <h4 className="m0">{appointment.diagnosis}</h4>
        <h2>Treatment Plan</h2>
        <h4 className="m0">{appointment.treatment_plan}</h4>
      </div>
      <button className="view-appointment-print-button" onClick={handlePrint}>
        Print
      </button>
    </div>
  );
};

export default ViewAppointment;
