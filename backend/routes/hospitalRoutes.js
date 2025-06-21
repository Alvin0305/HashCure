import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addDoctorToHospital,
  addHospitalComment,
  addHospitalSpeciality,
  addHospitalTiming,
  deleteHospitalComment,
  deleteHospitalTiming,
  editHospitalComment,
  getAllDistricts,
  getAllOwnershipTypes,
  getAllSpecialities,
  getDoctorsInHospital,
  getHospitalById,
  getHospitalComments,
  getHospitals,
  getHospitalSpecialities,
  getHospitalTimings,
  getPatientsInHospital,
  getUserRatingToHospital,
  rateHospital,
  removeDoctorFromHospital,
  removeHospitalSpeciality,
  updateHospital,
  updateHospitalImage,
  updateHospitalTiming,
} from "../controllers/hospitalController.js";
import multer from "../middlewares/multer.js";

const router = express.Router();

router.post("/doctor/:id", addDoctorToHospital);
router.get("/doctors/:id", getDoctorsInHospital);
router.delete("/doctor/:id", removeDoctorFromHospital);

router.post("/patients/:id", getPatientsInHospital);

router.post("/filter", getHospitals);
router.get("/districts", getAllDistricts);
router.get("/ownerships", getAllOwnershipTypes);

router.get("/specialities", getAllSpecialities);
router.get("/specialities/:id", getHospitalSpecialities);
router.post("/specialities/:id", addHospitalSpeciality);
router.delete("/specialities/:id", removeHospitalSpeciality);

router.get("/:id", getHospitalById);
router.put("/:id", updateHospital);

router.put("/upload/:id", multer.single("image"), updateHospitalImage);

router.post("/timing/:id", addHospitalTiming);
router.get("/timing/:id", getHospitalTimings);
router.put("/timing/:id", updateHospitalTiming);
router.delete("/timing/:id", deleteHospitalTiming);

router.post("/comments/:id", protect, addHospitalComment);
router.get("/comments/:id", getHospitalComments);
router.delete("/comments/:id", protect, deleteHospitalComment);
router.put("/comments/:id", protect, editHospitalComment);

router.post("/rating/:id", protect, rateHospital);
router.post("/user/rating/:id", getUserRatingToHospital);

export default router;
