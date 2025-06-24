import React, { useEffect, useState } from "react";
import { useUser } from "../../../contexts/userContext";
import { getAppointmentsByUser } from "../../../services/appointmentService";
import Heading from "../../../components/Heading/Heading";
import "./viewappointments.css";
import { generateAppointmentPDF } from "../../../utils/util";

const ViewAppointments = () => {
  const [appoinments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const { user } = useUser();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAppointmentsByUser(user.id, {});
        setAppointments(response.data);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAppointments();
  }, []);

  const handlePrint = () => {
    generateAppointmentPDF(selectedAppointment);
  };

  if (!appoinments) return <div>Loading...</div>;

  return (
    <div className="view-appointments-page">
      {appoinments.map((appointment, index) => (
        <div className="view-appointments-appointment" key={index}>
          <Heading
            name={new Date(appointment?.time).toLocaleDateString("default", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            onClick={() =>
              selectedAppointment?.id === appointment?.id
                ? setSelectedAppointment(null)
                : setSelectedAppointment(appointment)
            }
            enable
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
                    {new Date(appointment?.time).toLocaleTimeString("default", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }) || ""}
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
  );
};

export default ViewAppointments;
