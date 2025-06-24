import express from "express";
import {
  getConsultedDoctors,
  getDonors,
  getNotifications,
  getUserPreferences,
  getUserProfile,
  getVisitedHospitals,
  updateUserImage,
  updateUserPreferences,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import multer from "../middlewares/multer.js";

const router = express.Router();

router.get("/preferences/:id", getUserPreferences);
router.put("/preferences/:id", updateUserPreferences);

router.get("/notifications", protect, getNotifications);

router.get("/:id", getUserProfile);
router.put("/:id", updateUserProfile);

router.put("/upload/:id", multer.single("image"), updateUserImage);

router.get("/doctors/:id", getConsultedDoctors);
router.get("/hospitals/:id", getVisitedHospitals);
router.post("/donors", getDonors);

export default router;
