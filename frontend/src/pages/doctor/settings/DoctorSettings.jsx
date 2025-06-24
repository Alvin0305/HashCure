import React, { useEffect, useState } from "react";
import { useUser } from "../../../contexts/userContext";
import {
  getUserPreferences,
  updateUserPreferences,
} from "../../../services/userService";
import Heading from "../../../components/Heading/Heading";
import { Icon } from "@iconify/react/dist/iconify.js";

const DoctorSettings = () => {
  const { user } = useUser();
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await getUserPreferences(user.id);
        console.log(response.data);
        setPreferences(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await updateUserPreferences(user.id, {
        ...preferences,
        last_blood_donation_date: new Date(
          preferences.last_blood_donation_date
        ),
      });
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!preferences) return <div>Loading...</div>;

  return (
    <div className="settings-page">
      <Heading name="Blood Donation" />
      <div className="setting-content">
        <div className="flex gap-10 align-center">
          <input
            type="checkbox"
            checked={preferences.is_willing_to_donate_blood}
            onChange={(e) => {
              setPreferences((prev) => ({
                ...prev,
                is_willing_to_donate_blood: e.target.checked,
              }));
            }}
            className="check-box"
          />
          <h4 className="m0">Are you willing to donate blood</h4>
        </div>
        <div className="flex gap-10 align-center">
          <h4 className="m0">
            How frequently are you ready to donate blood{" "}
            <span className="settings-label">(in months)</span>
          </h4>
          <input
            type="text"
            disabled={!preferences.is_willing_to_donate_blood}
            value={preferences.frequency_of_blood_donation}
            onChange={(e) => {
              setPreferences((prev) => ({
                ...prev,
                frequency_of_blood_donation: e.target.value,
              }));
            }}
            className="settings-input"
          />
        </div>
        <div className="flex gap-10 align-center">
          <h4 className="m0">Last time you donated blood</h4>
          <input
            type="date"
            disabled={!preferences.is_willing_to_donate_blood}
            value={
              preferences.last_blood_donation_date
                ? new Date(preferences.last_blood_donation_date)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={(e) => {
              setPreferences((prev) => ({
                ...prev,
                last_blood_donation_date: e.target.value,
              }));
            }}
            className="settings-input"
          />
        </div>
      </div>
      <Heading name="General" />
      <div className="setting-content">
        <div className="flex gap-10 align-center">
          <h4 className="m0">Theme</h4>
          <select name="theme" className="drop-down">
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
      </div>
      <button className="settings-save-button" onClick={handleUpdate}>
        Save
      </button>
    </div>
  );
};

export default DoctorSettings;
