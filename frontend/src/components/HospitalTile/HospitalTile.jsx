import React from "react";
import "./hospitaltile.css";
import Rating from "../../utils/Rating/Rating";
import { Icon } from "@iconify/react";
import SmallBubble from "./SmallBubble";
import { useNavigate } from "react-router-dom";

const HospitalTile = ({ hospital }) => {
  const navigate = useNavigate();

  const gotoHospitalPage = () => {
    navigate("/patient/home/hospital", { state: { hospital: hospital } });
  };

  return (
    <div className="hospital-tile" onClick={gotoHospitalPage}>
      <div className="hospital-tile-left-div">
        <h1 className="hospital-tile-name">{hospital.name}</h1>
        <div className="hospital-tile-specialities">
          {hospital.specialities.map(
            (spec, index) =>
              index < 2 && (
                <SmallBubble name={spec.name} onClick={() => {}} key={index} />
              )
          )}
        </div>
        <h4 className="hospital-address">{hospital.address}</h4>
        <Rating rating={hospital.rating} />
      </div>
      <img
        src={hospital.image}
        alt="Hospital Image"
        className="hospital-tile-image"
      />
    </div>
  );
};

export default HospitalTile;
