import React, { useEffect, useState } from "react";
import { getPatients } from "../../../services/doctorService";
import { useUser } from "../../../contexts/userContext";
import { Icon } from "@iconify/react";
import "./patients.css";
import Slider from "rc-slider";
import PatientTile from "./PatientTile/PatientTile";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const { user } = useUser();
  const [searchValue, setSearchValue] = useState("");
  const minAge = 0;
  const maxAge = 100;
  const [ageRange, setAgeRange] = useState([20, 40]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getPatients(
          user.id,
          { age_start: ageRange[0], age_end: ageRange[1] },
          user.token
        );
        console.log(response.data);
        setPatients(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const refetchPatients = async () => {
      try {
        const response = await getPatients(
          user.id,
          { age_start: ageRange[0], age_end: ageRange[1], name: searchValue },
          user.token
        );
        console.log(response.data);
        setPatients(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    refetchPatients();
  }, [searchValue, ageRange]);

  return (
    <div className="doctor-patients-page">
      <div className="doctor-patients-search">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="doctor-patients-input"
          placeholder="Search..."
        />
        <Icon
          icon="lucide:search"
          width={32}
          height={32}
          className="doctor-patients-input-icon"
        />
      </div>
      <div className="doctor-patients-container">
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
    </div>
  );
};

export default Patients;
