import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SmallBubble from "../../../components/HospitalTile/SmallBubble";
import Rating from "../../../utils/Rating/Rating";

const DoctorTile = ({ doctor, onDelete }) => {
  useEffect(() => {
    console.log(doctor);
  }, []);

  const navigate = useNavigate();

  const navigateToDoctorPage = () => {
    navigate("/hospital-admin/home/doctor", { state: { doctor: doctor } });
  };

  return (
    <div className="doctor-tile" onClick={navigateToDoctorPage}>
      <div className="doctor-tile-details">
        <h3 className="doctor-tile-name">
          {doctor.firstname + " " + doctor.lastname}
        </h3>
        <div className="doctor-tile-specializations">
          {doctor.specializations &&
            doctor.specializations.length &&
            doctor.specializations.map(
              (specialization, index) =>
                specialization && (
                  <SmallBubble
                    name={specialization}
                    onClick={() => {}}
                    selected={false}
                    key={index}
                  />
                )
            )}
        </div>
        <h3 className="doctor-tile-hospital-name">{doctor.hospital_name}</h3>
        <Rating rating={doctor.rating} />
        <h4 className="doctor-tile-fees">{"₹ " + doctor.fees}</h4>
        <button onClick={onDelete} className="appointment-tile-button">
          Delete
        </button>
      </div>
      <img src={doctor.image} alt="Doctor" className="doctor-tile-image" />
    </div>
  );
};

export default DoctorTile;
