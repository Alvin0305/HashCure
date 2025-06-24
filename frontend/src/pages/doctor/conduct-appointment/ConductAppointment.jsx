import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAppointmentsByUser,
  updateAppointment,
} from "../../../services/appointmentService";
import "./conductappointment.css";
import Heading from "../../../components/Heading/Heading";
import { useUser } from "../../../contexts/userContext";

const ConductAppointment = () => {
  const location = useLocation();
  const { appointment } = location.state;
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [data, setData] = useState({
    chief_complaint: "",
    diagnosis: "",
    treatment_plan: "",
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointmentsByUser(appointment.patient_id, {
          dayFilter: "Previous",
        });
        console.log(response.data);
        setAppointments(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAppointments();
  }, [appointment]);

  const { user } = useUser();

  const handleMarkAsDone = async () => {
    try {
      const response = await updateAppointment(
        appointment.id,
        user.token,
        data
      );
      console.log(response.data);
      navigate("/doctor/home/appointments");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    generateAppointmentPDF(selectedAppointment);
  };

  const navigate = useNavigate();

  return (
    <div className="conduct-appointment-page">
      <div className="conduct-appointment-top-buttons">
        <button
          className="conduct-appointment-button"
          onClick={() =>
            navigate(`/doctor/home/patient/${appointment.patient_id}`)
          }
        >
          View Patient Profile
        </button>
        <button
          className="conduct-appointment-button"
          onClick={() =>
            navigate(`/doctor/home/reports/${appointment.patient_id}`)
          }
        >
          View Patient Reports
        </button>
      </div>
      <div className="conduct-appointment-div">
        <h3 className="m0">Chief Complaint</h3>
        <textarea
          name="chief-complaint"
          value={data.chief_complaint}
          placeholder="Chief Complaint..."
          onChange={(e) =>
            setData((prev) => ({ ...prev, chief_complaint: e.target.value }))
          }
          className="conduct-appointment-field chief-complaint-field"
        ></textarea>
        <h3 className="m0">Diagnosis</h3>
        <textarea
          name="diagnosis"
          value={data.diagnosis}
          onChange={(e) =>
            setData((prev) => ({ ...prev, diagnosis: e.target.value }))
          }
          placeholder="Diagnosis..."
          className="conduct-appointment-field diagnosis-field"
        ></textarea>
        <h3 className="m0">Treatment Plan</h3>
        <textarea
          name="treatment-plan"
          value={data.treatment_plan}
          onChange={(e) =>
            setData((prev) => ({ ...prev, treatment_plan: e.target.value }))
          }
          placeholder="Treatment Plan..."
          className="conduct-appointment-field treatment-plan-field"
        ></textarea>
      </div>
      <button className="conduct-appointment-button" onClick={handleMarkAsDone}>
        Mark As Done
      </button>
      <div className="width-100">
        {appointments.map((appointment, index) => (
          <div className="view-appointments-page" key={index}>
            <Heading
              name={new Date(appointment?.time).toLocaleDateString("default", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              enable
              onClick={() =>
                selectedAppointment?.id === appointment?.id
                  ? setSelectedAppointment(null)
                  : setSelectedAppointment(appointment)
              }
            />
            {selectedAppointment?.id === appointment?.id && (
              <div className="view-appointment-page">
                <div className="view-appointment-page-top">
                  <div className="view-appointment-page-top-left">
                    <h2 className="m0">{appointment?.doctor_name}</h2>
                    <h4 className="m0">
                      {new Date(appointment?.time).toDateString()}
                    </h4>
                    <h3 className="m0">{appointment?.hospital_name}</h3>
                  </div>
                  <div className="view-appointment-page-top-right">
                    <h3 className="m0">{appointment?.fees}</h3>
                    <h4 className="m0">
                      {new Date(appointment?.time).toLocaleTimeString(
                        "default",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      ) || ""}
                    </h4>
                  </div>
                </div>
                <div className="view-appointment-content">
                  <h2>Chief Complaint</h2>
                  <h4 className="m0">{appointment?.chief_complaint}</h4>
                  <h2>Diagnosis</h2>
                  <h4 className="m0">{appointment?.diagnosis}</h4>
                  <h2>Treatment Plan</h2>
                  <h4 className="m0">{appointment?.treatment_plan}</h4>
                </div>
                <button
                  className="view-appointment-print-button"
                  onClick={handlePrint}
                >
                  Print
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConductAppointment;
