import {
  getConsultedDoctorsFunction,
  getDonorsFunction,
  getNotificationsFunction,
  getUserPreferencesFunction,
  getUserProfileFunction,
  getVisitedHospitalsFunction,
  updateUserImageFunction,
  updateUserPreferencesFunction,
  updateUserProfileFunction,
} from "../models/user.js";
import { uploadToCloudinary } from "../utils/upload.js";

export const getConsultedDoctors = async (req, res) => {
  const { id } = req.params;
  try {
    const doctors = await getConsultedDoctorsFunction(id);
    res.json(doctors);
  } catch (err) {
    console.log("Failed to fetch doctors");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getVisitedHospitals = async (req, res) => {
  const { id } = req.params;
  try {
    const hospitals = await getVisitedHospitalsFunction(id);
    res.json(hospitals);
  } catch (err) {
    console.log("Failed to fetch hospitals");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getDonors = async (req, res) => {
  const { blood_group, age_start, age_end, bmi_start, bmi_end } = req.body;
  try {
    const donors = await getDonorsFunction(
      blood_group,
      age_start,
      age_end,
      bmi_start,
      bmi_end
    );
    res.json(donors);
  } catch (err) {
    console.log("Failed to fetch donors");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getNotifications = async (req, res) => {
  const user_id = req.user?.id;
  try {
    const notifications = await getNotificationsFunction(user_id);
    console.log(notifications);
    res.json(notifications);
  } catch (err) {
    console.log("Failed to fetch notifications");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getUserPreferences = async (req, res) => {
  const { id } = req.params;
  try {
    const preferences = await getUserPreferencesFunction(id);
    if (!preferences)
      return res.status(400).json({ error: "Failed to get user preferences" });
    res.json(preferences);
  } catch (err) {
    console.log("Failed to fetch user preferences");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateUserPreferences = async (req, res) => {
  const { id } = req.params;
  const {
    is_willing_to_donate_blood,
    frequency_of_blood_donation,
    allow_direct_booking,
    last_blood_donation_date,
  } = req.body;
  try {
    const preferences = await updateUserPreferencesFunction(
      id,
      is_willing_to_donate_blood,
      frequency_of_blood_donation,
      last_blood_donation_date,
      allow_direct_booking
    );
    if (!preferences)
      return res
        .status(400)
        .json({ error: "Failed to update user preferences" });
    res.json(preferences);
  } catch (err) {
    console.log("Failed to update user preferences");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserProfileFunction(id);
    if (!user) return res.status(400).json({ error: "Failed to fetch user" });
    res.json(user);
  } catch (err) {
    console.log("Failed to fetch user");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { userData } = req.body;
  console.log("user data", userData);
  console.log("body", req.body);
  try {
    const user = await updateUserProfileFunction(id, userData);
    if (!user) return res.status(400).json({ error: "Failed to update user" });
    res.json(user);
  } catch (err) {
    console.log("Failed to update user");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateUserImage = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.file) return res.status(400).json({ error: "File not found" });
    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      "patients/images"
    );
    const result = await updateUserImageFunction(id, uploadResult.secure_url);
    if (!result)
      return res.status(400).json({ error: "failed to upload image" });
    res.json(result);
  } catch (err) {
    console.log("Failed to update image");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// ------- completed not checked ---------
