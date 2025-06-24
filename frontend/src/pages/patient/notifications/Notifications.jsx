import React, { useEffect, useState } from "react";
import "./notifications.css";
import { useUser } from "../../../contexts/userContext";
import { getUserNotifications } from "../../../services/userService";
import Heading from "../../../components/Heading/Heading";
import socket from "../../../sockets/socket";

const Notifications = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState({});

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getUserNotifications(user.token);
        console.log(response.data);
        setNotifications(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleIncomingNotification = ({ appointment, notification }) => {
      console.log("received a new notification", notification);
      setNotifications((prev) => ({
        ...prev,
        today: [notification, ...prev.today],
      }));
    };
    socket.on("appointment_created", handleIncomingNotification);
    socket.on("appointment_cancelled", handleIncomingNotification);
    socket.on("appointment_confirmed", handleIncomingNotification);

    return () => {
      socket.off("appointment_created", handleIncomingNotification);
      socket.off("appointment_cancelled", handleIncomingNotification);
      socket.off("appointment_confirmed", handleIncomingNotification);
    };
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="notifications-page">
      {notifications?.today?.length ? <Heading name="Today" /> : ""}
      <div className="notitications-container">
        {notifications?.today?.map((notification, index) => (
          <h4 key={index} className="notification">
            {notification.content}
          </h4>
        ))}
      </div>
      {notifications?.yesterday?.length ? <Heading name="Yesterday" /> : ""}
      <div className="notitications-container">
        {notifications?.yesterday?.map((notification, index) => (
          <h4 key={index} className="notification">
            {notification.content}
          </h4>
        ))}
      </div>
      {notifications?.previous?.length ? <Heading name="Previous" /> : ""}
      <div className="notitications-container">
        {notifications?.previous?.map((notification, index) => (
          <h4 key={index} className="notification">
            {notification.content}
          </h4>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
