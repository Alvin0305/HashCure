import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  cancelAppointmentsOfUser,
  createAppointment,
  deleteAppointmentsOfUser,
  getAllAppointmentsOfUser,
  getAppointmentById,
  getAppointmentsByDoctor,
  getAppointmentsByUser,
  getFixedAppointments,
  updateAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/", protect, createAppointment);
router.put("/:id", protect, updateAppointment);
router.delete("/:id", protect, deleteAppointmentsOfUser);
router.put("/cancel/:id", protect, cancelAppointmentsOfUser);

router.get("/:id", getAppointmentById);
router.get("/patient/:id", getAllAppointmentsOfUser);

router.post("/patient/:id", getAppointmentsByUser);
router.post("/doctor/:id", getAppointmentsByDoctor);

router.post("/all/:id", getFixedAppointments);

export default router;
