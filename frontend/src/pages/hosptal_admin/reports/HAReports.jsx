import React, { useEffect, useState } from "react";
import { getDoctors } from "../../../services/doctorService";
import { getPatientsInHospital } from "../../../services/hospitalService";
import { useHospital } from "../../../contexts/hospitalContext";
import Reports from "../../patient/reports/Reports";

const HAReports = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const { hospital } = useHospital();

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
    <div className="flex col gap-10 width-100">
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
      {selectedPatient ? (
        <Reports u_id={selectedPatient} />
      ) : (
        <p>Select a patient to view his/her reports</p>
      )}
    </div>
  );
};

export default HAReports;
