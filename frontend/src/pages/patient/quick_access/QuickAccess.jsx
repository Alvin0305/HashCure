import React, { useEffect, useState } from "react";
import "./quickaccess.css";
import { useUser } from "../../../contexts/userContext";
import {
  getConsultedDoctors,
  getVisitedHospitals,
} from "../../../services/userService";
import DoctorTile from "../../../components/DoctorTile/DoctorTile";
import HospitalTile from "../../../components/HospitalTile/HospitalTile";

const QuickAccess = () => {
  const { user } = useUser();
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchInitials = async () => {
      try {
        const [doctorResponse, hospitalResponse] = await Promise.all([
          getConsultedDoctors(user.id),
          getVisitedHospitals(user.id),
        ]);
        setDoctors(doctorResponse.data);
        setHospitals(hospitalResponse.data);
        console.log(doctorResponse.data);
        console.log(hospitalResponse.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInitials();
  }, []);
  return (
    <div className="quick-access-page">
      <h2 className="m0">Consulted Doctors</h2>
      <div className="quick-access-doctors">
        {doctors.map((doctor, index) => (
          <DoctorTile doctor={doctor} key={index} />
        ))}
      </div>
      <h2 className="m0">Visited Hospitals</h2>
      <div className="quick-access-hospitals">
        {hospitals.map((hospital, index) => (
          <HospitalTile hospital={hospital} key={index} />
        ))}
      </div>
    </div>
  );
};

export default QuickAccess;
