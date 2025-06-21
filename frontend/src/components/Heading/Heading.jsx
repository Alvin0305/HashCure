import React from "react";
import "./heading.css";

const Heading = ({ name, enable, onClick }) => {
  return (
    <div className="heading" onClick={enable ? onClick : () => {}}>
      <h3 className="m0">{name}</h3>
      <div className="heading-line"></div>
    </div>
  );
};

export default Heading;
