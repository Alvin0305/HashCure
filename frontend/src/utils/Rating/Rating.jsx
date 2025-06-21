import { useState } from "react";
import "./rating.css";
import { Icon } from "@iconify/react";

const Rating = ({ rating, enabled, apiCall }) => {
  const [ratingState, setRatingState] = useState(rating);

  const onClick = (index) => {
    if (enabled) {
      setRatingState(index);
      apiCall(index);
    }
  };
  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((rate) => (
        <Icon
          icon={rate <= ratingState ? "tabler:star-filled" : "tabler:star"}
          width={32}
          height={32}
          className={`star ${enabled && "pointer"}`}
          color="gold"
          key={rate}
          onClick={() => onClick(rate)}
        />
      ))}
    </div>
  );
};

export default Rating;
