import React from "react";
import "./smallbubble.css";

const SmallBubble = ({ name, onClick, selected }) => {
  return (
    <div
      className={`small-bubble ${selected && "selected-small-bubble"}`}
      onClick={onClick}
    >
      <h4 className="m0">{name}</h4>
    </div>
  );
};

export default SmallBubble;
