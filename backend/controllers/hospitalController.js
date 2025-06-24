import {
  addDoctorToHospitalFunction,
  addHospitalCommentFunction,
  addHospitalSpecialityFunction,
  addHospitalTimingsFunction,
  createDoctorFunction,
  deleteHospitalCommentsFunction,
  deleteHospitalTimingFunction,
  editHospitalCommentsFunction,
  getAllDistrictsFunction,
  getAllSpecialitiesFunction,
  getDoctorsInHospitalFunction,
  getHospitalByAdminIdFunction,
  getHospitalByIdFunction,
  getHospitalCommentsFunction,
  getHospitalsFunction,
  getHospitalSpecialitiesFunction,
  getHospitalTimingFunction,
  getHospitalTimingsFunction,
  getPatientsInHospitalFunction,
  getUserRatingToHospitalFunction,
  rateHospitalFunction,
  removeDoctorFromHospitalFunction,
  removeHospitalSpecialityFunction,
  updateHospitalFunction,
  updateHospitalImageFunction,
  updateHospitalTimingFunction,
} from "../models/hospital.js";

import bcrypt from "bcryptjs";
import { uploadToCloudinary } from "../utils/upload.js";

export const getHospitals = async (req, res) => {
  const { searchValue, district, specialities, ownership } = req.body;

  console.log(searchValue, district, specialities, ownership);

  try {
    const hospitals = await getHospitalsFunction(
      searchValue,
      district,
      specialities,
      ownership
    );
    res.json(hospitals);
  } catch (err) {
    console.log("Error fetching hospitals");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getHospitalById = async (req, res) => {
  const { id } = req.params;
  try {
    const hospital = await getHospitalByIdFunction(id);
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });
    res.json(hospital);
  } catch (err) {
    console.log("Error fetching hospital details");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getHospitalByAdminId = async (req, res) => {
  const { id } = req.params;
  try {
    const hospital = await getHospitalByAdminIdFunction(id);
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });
    res.json(hospital);
  } catch (err) {
    console.log("Error fetching hospital details");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllSpecialities = async (req, res) => {
  try {
    const specs = await getAllSpecialitiesFunction();

    res.json(specs);
  } catch (err) {
    console.log("Error fetching specs");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getHospitalSpecialities = async (req, res) => {
  const { id } = req.params;
  try {
    const specs = await getHospitalSpecialitiesFunction(id);

    res.json(specs);
  } catch (err) {
    console.log("Error fetching specs");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const addHospitalSpeciality = async (req, res) => {
  const { id } = req.params;
  const { speciality } = req.body;
  try {
    const spec = await addHospitalSpecialityFunction(id, speciality);
    if (!spec) return res.status(400).json({ error: "Failed to add spec" });
    res.json(spec);
  } catch (err) {
    console.log("Error adding specs");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const removeHospitalSpeciality = async (req, res) => {
  const { id } = req.params;
  const { speciality } = req.query;
  try {
    const spec = await removeHospitalSpecialityFunction(id, speciality);
    if (!spec) return res.status(400).json({ error: "Failed to remove spec" });
    res.json({ message: "Spec removed succesfully" });
  } catch (err) {
    console.log("Error removing specs");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateHospital = async (req, res) => {
  const { id } = req.params;
  const { district, address, phone, started_at, description, ownership } =
    req.body;

  try {
    const updatedHospital = await updateHospitalFunction(
      id,
      district,
      address,
      phone,
      started_at,
      description,
      ownership
    );
    if (!updatedHospital)
      return res.status(400).json({ error: "Failed to update hospital" });
    res.json(updatedHospital);
  } catch (err) {
    console.log("Error updating hospitals");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateHospitalImage = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("1");
    if (!req.file) return res.status(400).json({ error: "image not found" });
    console.log("2");
    const uploadResult = await uploadToCloudinary(req.file.buffer, "hospitals");
    console.log("3", uploadResult);
    const result = await updateHospitalImageFunction(
      id,
      uploadResult.secure_url
    );
    console.log("4");
    res.json(result);
  } catch (err) {
    console.log("Error updating hospital image");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getHospitalTimings = async (req, res) => {
  const { id } = req.params;
  try {
    const timings = await getHospitalTimingsFunction(id);
    if (!timings) return res.status(404).json({ error: "not found" });
    res.json(timings);
  } catch (err) {
    console.log("Failed to fetch timings");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateHospitalTiming = async (req, res) => {
  const { id } = req.params;
  let { day, start_time, end_time } = req.body;
  try {
    const existingTiming = await getHospitalTimingFunction(id, day);

    if (!start_time) start_time = existingTiming.start_time;
    if (!end_time) end_time = existingTiming.end_time;

    const updatedTiming = await updateHospitalTimingFunction(
      id,
      day,
      start_time,
      end_time
    );
    if (!updatedTiming)
      return res.status(400).json({ error: "Failed to update timing" });
    res.json(updatedTiming);
  } catch (err) {
    console.log("Failed to update timing");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteHospitalTiming = async (req, res) => {
  const { id } = req.params;
  const { day } = req.body;
  try {
    const deletedTiming = await deleteHospitalTimingFunction(id, day);
    if (!deletedTiming)
      return res.status(400).json({ error: "Failed to delete timing" });
    res.json({ message: "Timing deleted succesfully" });
  } catch (err) {
    console.log("Failed to delete timing");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const addHospitalTiming = async (req, res) => {
  const { id } = req.params;
  const { day, start_time, end_time } = req.body;
  try {
    const timings = await addHospitalTimingsFunction(
      id,
      day,
      start_time,
      end_time
    );
    if (!timings)
      return res.status(400).json({ error: "Failed to add timing" });
    res.json(timings);
  } catch (err) {
    console.log("Failed to add timing");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getDoctorsInHospital = async (req, res) => {
  const { id } = req.params;
  try {
    const doctors = await getDoctorsInHospitalFunction(id);
    if (!doctors)
      return res.status(400).json({ error: "Failed to fetch doctors" });
    res.json(doctors);
  } catch (err) {
    console.log("Failed to fetch doctors");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const removeDoctorFromHospital = async (req, res) => {
  const { id } = req.params;
  const { doctor_id } = req.query;
  try {
    const deletedDoctor = await removeDoctorFromHospitalFunction(id, doctor_id);
    if (!deletedDoctor)
      return res.status(400).json({ error: "Failed to delete doctor" });
    res.json({ message: "Doctor successfully removed" });
  } catch (err) {
    console.log("Failed to remove doctor");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const addDoctorToHospital = async (req, res) => {
  const hospital_id = req.params.id;
  const { firstname, lastname, email, password } = req.body;
  try {
    console.log(firstname, lastname, email, password, hospital_id);
    const password_hash = await bcrypt.hash(password, 10);
    const newDoctor = await createDoctorFunction(
      firstname,
      lastname,
      email,
      password_hash
    );
    console.log("here", newDoctor.id, hospital_id);
    if (!newDoctor)
      return res.status(400).json({ error: "Failed to create doctor" });
    const result = await addDoctorToHospitalFunction(hospital_id, newDoctor.id);
    console.log("there: ", result);
    res.json(newDoctor);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getPatientsInHospital = async (req, res) => {
  const { id } = req.params;
  const { searchValue, doctorId, ageStart, ageEnd } = req.body;
  console.log("doctor name: ", doctorId);
  try {
    const patients = await getPatientsInHospitalFunction(
      id,
      searchValue,
      doctorId,
      ageStart,
      ageEnd
    );
    res.json(patients);
  } catch (err) {
    console.log("Failed to fetch patients");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getHospitalComments = async (req, res) => {
  const { id } = req.params;
  try {
    const comments = await getHospitalCommentsFunction(id);
    if (!comments)
      return res.status(400).json({ error: "Failed to fetch comments" });
    res.json(comments);
  } catch (err) {
    console.log("Failed to fetch comments");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const addHospitalComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const user_id = req.user?.id;
  try {
    const newComment = await addHospitalCommentFunction(id, user_id, comment);
    if (!newComment)
      return res.status(400).json({ error: "Failed to add comment" });
    res.json(newComment);
  } catch (err) {
    console.log("Failed to add comment");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteHospitalComment = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user?.id;
  try {
    const deletedComment = await deleteHospitalCommentsFunction(id, user_id);
    if (!deletedComment)
      return res.status(400).json({ error: "Failed to delete comment" });
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.log("Failed to delete comment");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const editHospitalComment = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user?.id;
  const { comment } = req.body;
  try {
    const editedComment = await editHospitalCommentsFunction(
      id,
      user_id,
      comment
    );
    if (!editedComment)
      return res.status(400).json({ error: "Failed to edit comment" });
    res.json(editedComment);
  } catch (err) {
    console.log("Failed to edit comment");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const rateHospital = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user?.id;
  const { rating } = req.body;

  try {
    const newRating = await rateHospitalFunction(id, user_id, rating);
    if (!newRating)
      return res.status(400).json({ error: "Failed to add / update rating" });
    res.json(newRating);
  } catch (err) {
    console.log("Failed to add rating");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllDistricts = async (req, res) => {
  console.log("getting districts");
  try {
    const districts = await getAllDistrictsFunction();
    console.log(districts);
    res.json(districts);
  } catch (err) {
    console.log("Failed to get all districts");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllOwnershipTypes = async (req, res) => {
  res.json([
    "Government",
    "Private",
    "NGO/Trust",
    "Public-Private Partnership",
  ]);
};

export const getUserRatingToHospital = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const rating = await getUserRatingToHospitalFunction(id, user_id);
    return res.json(rating);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
