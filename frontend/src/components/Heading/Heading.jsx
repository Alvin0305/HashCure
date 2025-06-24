import React from "react";
import "./heading.css";
import { Icon } from "@iconify/react/dist/iconify.js";

const Heading = ({ name, enable, onClick }) => {
  return (
    <div
      className={`heading ${enable ? "pointer" : ""}`}
      onClick={enable ? onClick : () => {}}
    >
      <h3 className="m0">{name}</h3>
      <div className="heading-line"></div>
      {enable && <Icon icon="lucide:chevron-down" width={24} height={24} />}
    </div>
  );
};

export default Heading;
