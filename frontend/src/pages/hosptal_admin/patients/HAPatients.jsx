import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { getPatientsInHospital } from "../../../services/hospitalService";
import { getDoctors } from "../../../services/doctorService";
import { useHospital } from "../../../contexts/hospitalContext";
import Slider from "rc-slider";
import PatientTile from "./PatientTile";

const HAPatients = () => {
  const minAge = 0;
  const maxAge = 100;
  const [searchValue, setSearchValue] = useState("");
  const [patients, setPatients] = useState([]);
  const [ageRange, setAgeRange] = useState([20, 60]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

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
        const filterData = {
          ageStart: ageRange[0],
          ageEnd: ageRange[1],
          searchValue,
        };
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
  }, [searchValue, selectedDoctor, ageRange]);

  return (
    <div className="ha-patients-page">
      <div className="search-field">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          className="search-input"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Icon icon="lucide:search" width={32} height={32} color="black" />
      </div>
      <div className="doctor-fee-slider">
        <h3 className="blood-donation-label">Age</h3>
        <h3 className="doctor-fee-slider-label">
          {ageRange[0] + " - " + ageRange[1]}
        </h3>
        <Slider
          range
          min={minAge}
          max={maxAge}
          value={ageRange}
          onChange={(values) => {
            setAgeRange(values);
          }}
          step={1}
        />
      </div>
      <div className="doctor-patients">
        {patients.map((patient, index) => (
          <PatientTile user={patient} key={index} />
        ))}
      </div>
    </div>
  );
};

export default HAPatients;
