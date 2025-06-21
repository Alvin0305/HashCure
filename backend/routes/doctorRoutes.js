import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addDoctorComment,
  addDoctorWorkingHour,
  addPreviouslyWorkedHospitals,
  addSpecializationForDoctor,
  approveAnAppointment,
  deleteDoctorComment,
  getAllPatients,
  getAllSpecializations,
  getDoctorById,
  getDoctorComments,
  getDoctorPreviouslyWorkedHospitals,
  getDoctors,
  getDoctorSpecializations,
  getDoctorWorkingHours,
  getUserRatingToDoctor,
  rateDoctor,
  removeDoctorWorkingHour,
  removeFromPreviouslyWorkedHospitals,
  removeSpecializationForDoctor,
  updateDoctor,
  updateDoctorComment,
  updateDoctorWorkingHour,
} from "../controllers/doctorController.js";

const router = express.Router();

router.post("/filter", getDoctors);

router.post("/specialization/:id", protect, addSpecializationForDoctor);
router.get("/specialization/:id", protect, getDoctorSpecializations);
router.delete("/specialization/:id", protect, removeSpecializationForDoctor);
router.get("/specializations", getAllSpecializations);

router.post("/schedule/:id", addDoctorWorkingHour);
router.delete("/schedule", protect, removeDoctorWorkingHour);
router.put("/schedule", protect, updateDoctorWorkingHour);
router.get("/schedule/:id", getDoctorWorkingHours);

router.post("/experiences", protect, addPreviouslyWorkedHospitals);
router.delete("/experiences", protect, removeFromPreviouslyWorkedHospitals);
router.get("/experiences", protect, getDoctorPreviouslyWorkedHospitals);

router.post("/comments", protect, addDoctorComment);
router.get("/comments/:id", getDoctorComments);
router.delete("/comments", protect, deleteDoctorComment);
router.put("/comments", protect, updateDoctorComment);

router.post("/patients/:id", protect, getAllPatients);

router.post("/rating", protect, rateDoctor);
router.post("/user/rating/:id", getUserRatingToDoctor);

router.patch("/approve/:id", protect, approveAnAppointment);

router.put("/:id", protect, updateDoctor);
router.get("/:id", getDoctorById);

export default router;

// Mine: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzQ5MDQ1NDk4LCJleHAiOjE3NDk2NTAyOTh9.L02TIypsbSFwewqBC_YJRNQHB5MCXq-pVgo-X4lFrtg
