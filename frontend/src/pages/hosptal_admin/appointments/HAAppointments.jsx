import React, { useEffect, useState } from "react";
import { getDoctors, getPatients } from "../../../services/doctorService";
import { useHospital } from "../../../contexts/hospitalContext";
import { getPatientsInHospital } from "../../../services/hospitalService";
import ViewAppointments from "../../patient/view_appointments/ViewAppointments";
import { getAppointmentsByUser } from "../../../services/appointmentService";
import { generateAppointmentPDF } from "../../../utils/util";
import Heading from "../../../components/Heading/Heading";

const HAAppointments = () => {
  const { hospital } = useHospital();

  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appoinments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (!selectedPatient) {
      setAppointments([]);
      return;
    }
    console.log(selectedPatient);
    const fetchAppointments = async () => {
      try {
        const response = await getAppointmentsByUser(selectedPatient, {});
        setAppointments(response.data);
        console.log(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAppointments();
  }, [selectedPatient]);

  const handlePrint = () => {
    generateAppointmentPDF(selectedAppointment);
  };

  useEffect(() => {
    const fetchInitials = async () => {
      try {
        const [doctorResponse, patientResponse] = await Promise.all([
          getDoctors({ hospitalName: hospital.name }),
          getPatientsInHospital(hospital.id, {}),
        ]);
        console.log(doctorResponse.data);
        console.log(patientResponse.data);

        setDoctors(doctorResponse.data);
        setPatients(patientResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitials();
  }, []);

  useEffect(() => {
    const refetchPatients = async () => {
      try {
        const filterData = {};
        if (selectedDoctor) {
          filterData["doctorId"] = selectedDoctor;
        }

        const patientResponse = await getPatientsInHospital(
          hospital.id,
          filterData
        );

        console.log(patientResponse.data);
        setPatients(patientResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    refetchPatients();
  }, [selectedDoctor]);

  return (
    <div className="ha-appointments">
      <div className="flex gap-10">
        <select
          name="doctor"
          value={selectedDoctor}
          className="drop-down"
          onChange={(e) => setSelectedDoctor(e.target.value)}
        >
          <option value="">Doctor...</option>
          {doctors.map((doctor) => (
            <option value={doctor.id} key={doctor.id}>
              {doctor.firstname + " " + doctor.lastname}
            </option>
          ))}
        </select>
        <select
          name="patient"
          value={selectedPatient}
          className="drop-down"
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          <option value="">Patient...</option>
          {patients.map((patient) => (
            <option value={patient.id} key={patient.id}>
              {patient.firstname + " " + patient.lastname}
            </option>
          ))}
        </select>
      </div>
      {!selectedPatient && <p>Select a patient to view their appointments</p>}
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

export default HAAppointments;
