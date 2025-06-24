import {
  addDoctorCommentFunction,
  addDoctorWorkingHourFunction,
  addPreviouslyWorkedHospitalsFunction,
  addSpecializationForDoctorFunction,
  approveAnAppointmentFunction,
  deleteDoctorCommentFunction,
  deleteDoctorWorkingHourFunction,
  getAllPatientsFunction,
  getAllSpecializationsFunction,
  getDoctorByIdFunction,
  getDoctorCommentFunction,
  getDoctorFunction,
  getDoctorPreviouslyWorkedHospitalsFunction,
  getDoctorSpecializationsFunction,
  getDoctorWorkingHoursFunction,
  getUserRatingToDoctorFunction,
  rateDoctorFunction,
  removePreviouslyWorkedHospitalsFunction,
  removeSpecializationForDoctorFunction,
  updateDoctorCommentFunction,
  updateDoctorFunction,
  updateDoctorWorkingHourFunction,
} from "../models/doctor.js";

export const getDoctors = async (req, res) => {
  const {
    searchValue,
    district,
    hospitalName,
    specialization,
    dayFilter,
    gender,
    feeStart,
    feeEnd,
  } = req.body;
  console.log(req.body);
  try {
    const doctors = await getDoctorFunction(
      searchValue,
      district,
      hospitalName,
      specialization,
      dayFilter,
      gender,
      feeStart,
      feeEnd
    );
    res.json(doctors);
  } catch (err) {
    console.log("Failed to get doctors");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getDoctorById = async (req, res) => {
  const { id } = req.params;
  try {
    const doctor = await getDoctorByIdFunction(id);
    if (!doctor) return res.status(400).json({ error: "Failed to get doctor" });
    res.json(doctor);
  } catch (err) {
    console.log("Failed to get doctor");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateDoctor = async (req, res) => {
  const { id } = req.params;
  const { doctorData } = await req.body;
  console.log("data: ", doctorData);
  try {
    const updatedDoctor = await updateDoctorFunction(id, doctorData);
    if (!updatedDoctor)
      return res.status(400).json({ error: "Failed to update doctor" });
    res.json(updatedDoctor);
  } catch (err) {
    console.log("Failed to update doctor");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllSpecializations = async (req, res) => {
  try {
    const specializations = await getAllSpecializationsFunction();
    res.json(specializations);
  } catch (err) {
    console.log("Failed to get spec");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getDoctorSpecializations = async (req, res) => {
  const { id } = req.params;
  try {
    const specializations = await getDoctorSpecializationsFunction(id);
    res.json(specializations);
  } catch (err) {
    console.log("Failed to get spec");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const addSpecializationForDoctor = async (req, res) => {
  const { id } = req.params;
  const { specialization } = req.body;
  try {
    const newSpecialization = await addSpecializationForDoctorFunction(
      id,
      specialization
    );
    if (!newSpecialization)
      return res.status(400).json({ error: "Failed to add spec" });
    res.json(newSpecialization);
  } catch (err) {
    console.log("Failed to add spec");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const removeSpecializationForDoctor = async (req, res) => {
  const { id } = req.params;
  const { specialization } = req.query;
  try {
    const deletedSpecialization = await removeSpecializationForDoctorFunction(
      id,
      specialization
    );
    if (!deletedSpecialization)
      return res.status(400).json({ error: "Failed to remove spec" });
    res.json({ message: "Specialization removed successfully" });
  } catch (err) {
    console.log("Failed to remove spec");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getDoctorWorkingHours = async (req, res) => {
  const doctor_id = req.params.id;

  try {
    const schedules = await getDoctorWorkingHoursFunction(doctor_id);
    if (!schedules)
      return res.status(400).json({ error: "Failed to fetch doctor schedule" });
    res.json(schedules);
  } catch (err) {
    console.log("Failed to fetch doctor schedule");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const addDoctorWorkingHour = async (req, res) => {
  const doctor_id = req.params?.id;
  const { day, start_time, end_time } = req.body;
  console.log(req.body);

  try {
    const newSchedule = await addDoctorWorkingHourFunction(
      doctor_id,
      day,
      start_time,
      end_time
    );
    if (!newSchedule)
      return res.status(400).json({ error: "Failed to add doctor schedule" });
    res.json(newSchedule);
  } catch (err) {
    console.log("Failed to add doctor schedule");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const removeDoctorWorkingHour = async (req, res) => {
  const doctor_id = req.params.id;
  const { day, start_time, end_time } = req.query;

  try {
    const deletedSchedule = await deleteDoctorWorkingHourFunction(
      doctor_id,
      day,
      start_time,
      end_time
    );
    if (!deletedSchedule)
      return res
        .status(400)
        .json({ error: "Failed to delete doctor schedule" });
    res.json({ message: "Schedule succesfully deleted" });
  } catch (err) {
    console.log("Failed to delete doctor schedule");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateDoctorWorkingHour = async (req, res) => {
  const doctor_id = req.params.id;
  const { day, start_time, end_time, new_start_time, new_end_time } = req.body;

  try {
    const updatedSchedule = await updateDoctorWorkingHourFunction(
      doctor_id,
      day,
      start_time,
      end_time,
      new_start_time,
      new_end_time
    );
    if (!updatedSchedule)
      return res
        .status(400)
        .json({ error: "Failed to update doctor schedule" });
    res.json(updatedSchedule);
  } catch (err) {
    console.log("Failed to update doctor schedule");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getDoctorPreviouslyWorkedHospitals = async (req, res) => {
  const doctor_id = req.user?.id;

  try {
    const hospitals = await getDoctorPreviouslyWorkedHospitalsFunction(
      doctor_id
    );
    if (!hospitals || !hospitals.length)
      return res.status(400).json({ error: "Failed to get previous hospital" });
    res.json(hospitals);
  } catch (err) {
    console.log("Failed to get previous hospital");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const addPreviouslyWorkedHospitals = async (req, res) => {
  const doctor_id = req.user?.id;
  const { years, hospital_id } = req.body;

  try {
    const prevHospital = await addPreviouslyWorkedHospitalsFunction(
      doctor_id,
      hospital_id,
      years
    );
    if (!prevHospital)
      return res.status(400).json({ error: "Failed to add previous hospital" });
    res.json(prevHospital);
  } catch (err) {
    console.log("Failed to add previous hospital");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const removeFromPreviouslyWorkedHospitals = async (req, res) => {
  const doctor_id = req.user?.id;
  const { hospital_id } = req.body;

  try {
    const deletedHospital = await removePreviouslyWorkedHospitalsFunction(
      doctor_id,
      hospital_id
    );
    if (!deletedHospital)
      return res
        .status(400)
        .json({ error: "Failed to remove previous hospital" });
    res.json({ message: "Hospital removed succesfully" });
  } catch (err) {
    console.log("Failed to remove previous hospital");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getDoctorComments = async (req, res) => {
  const doctor_id = req.params?.id;
  try {
    const comments = await getDoctorCommentFunction(doctor_id);
    if (!comments)
      return res.status(400).json({ error: "Failed to get comment" });
    res.json(comments);
  } catch (err) {
    console.log("Failed to get comment");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const addDoctorComment = async (req, res) => {
  const user_id = req.user?.id;
  const { doctor_id, comment } = req.body;
  try {
    const newComment = await addDoctorCommentFunction(
      user_id,
      doctor_id,
      comment
    );
    if (!newComment)
      return res.status(400).json({ error: "Failed to add comment" });
    res.json(newComment);
  } catch (err) {
    console.log("Failed to add comment");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteDoctorComment = async (req, res) => {
  const user_id = req.user?.id;
  const { doctor_id } = req.body;
  try {
    const deletedComment = await deleteDoctorCommentFunction(
      user_id,
      doctor_id
    );
    if (!deletedComment)
      return res.status(400).json({ error: "Failed to delete comment" });
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.log("Failed to delete comment");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const updateDoctorComment = async (req, res) => {
  const user_id = req.user?.id;
  const { doctor_id, comment } = req.body;
  try {
    const editedComment = await updateDoctorCommentFunction(
      user_id,
      doctor_id,
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

export const rateDoctor = async (req, res) => {
  const user_id = req.user?.id;
  const { doctor_id, rating } = req.body;
  try {
    const ratingGiven = await rateDoctorFunction(user_id, doctor_id, rating);
    if (!ratingGiven) return res.status(400).json({ error: "Failed to rate" });
    res.json(ratingGiven);
  } catch (err) {
    console.log("Failed to rate");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllPatients = async (req, res) => {
  const { id } = req.params;
  const { name, age_start, age_end } = req.body;
  try {
    const patients = await getAllPatientsFunction(id, name, age_start, age_end);
    res.json(patients);
  } catch (err) {
    console.log("Failed to get patients");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const approveAnAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const approvedAppointment = await approveAnAppointmentFunction(id);
    if (!approvedAppointment)
      return res.status(400).json({ error: "Failed to approve" });
    res.json(approvedAppointment);
  } catch (err) {
    console.log("Failed to approve");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getUserRatingToDoctor = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const rating = await getUserRatingToDoctorFunction(id, user_id);
    return res.json(rating);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// ------- completed not checked ---------
