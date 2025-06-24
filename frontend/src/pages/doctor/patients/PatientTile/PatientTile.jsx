import React from "react";
import "./patienttile.css";
import { useNavigate } from "react-router-dom";

const PatientTile = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div
      className="patient-tile"
      onClick={() => navigate(`/doctor/home/patient/${user.id}`)}
    >
      <div className="patient-tile-left">
        <h2 className="m0">{user.firstname + " " + user.lastname}</h2>
        <h3 className="m0">{`BMI: ${parseFloat(user.bmi).toFixed(2)}`}</h3>
        <h3 className="m0">{user.phone}</h3>
        <h4 className="m0">{user.email}</h4>
      </div>
      <div className="patient-tile-right">
        <img
          src={user.image ?? "./avatar.webp"}
          alt="User"
          className="patient-tile-image"
        />
        <h4 className="m0">{`Age: ${user.age}`}</h4>
      </div>
    </div>
  );
};

export default PatientTile;
