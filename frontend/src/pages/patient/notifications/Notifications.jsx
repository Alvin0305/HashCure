import React, { useEffect } from "react";
import "./notifications.css";
import { useUser } from "../../../contexts/userContext";

const Notifications = () => {
  const { user } = useUser();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
      } catch (err) {
        console.error(err);
      }
    };
  }, []);
  return <div className="notifications-page"></div>;
};

export default Notifications;
