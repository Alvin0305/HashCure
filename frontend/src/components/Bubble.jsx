import React from "react";
import "./bubble.css";

const Bubble = ({ name, onClick, selected }) => {
  return (
    <div
      className={`bubble ${selected && "selected-bubble"}`}
      onClick={onClick}
    >
      <h4 className="m0 bubble-text">{name}</h4>
    </div>
  );
};

export default Bubble;
