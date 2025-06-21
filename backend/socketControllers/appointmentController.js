import pool from "../db.js";
import { createAppointmentFunction } from "../models/appointment.js";

export const createAppointment = async ({ appointment, io }) => {
  await createAppointmentFunction(
    appointment.patient_id,
    appointment.doctor_id,
    appointment.purpose,
    appointment.time
  );

  io.to(`chat_${patient_id}`).emit("appointment_created", { appointment });
  io.to(`chat_${doctor_id}`).emit("appointment_created", { appointment });
};

export const cancelAppointment = async ({ appt, io }) => {
  const { rows } = await pool.query(
    `UPDATE appointments
        SET status = 'Cancelled' 
        WHERE id = $1
        RETURNING *`,
    [appt.id]
  );

  const appointment = rows[0];

  io.to(`chat_${patient_id}`).emit("appointment_cancelled", { appointment });
  io.to(`chat_${doctor_id}`).emit("appointment_cancelled", { appointment });
};

export const confirmAppointment = async ({ appt, io }) => {
  const { rows } = await pool.query(
    `UPDATE appointments
          SET status = 'Scheduled' 
          WHERE id = $1
          RETURNING *`,
    [appt.id]
  );

  const appointment = rows[0];

  io.to(`chat_${patient_id}`).emit("appointment_confirmed", { appointment });
  io.to(`chat_${doctor_id}`).emit("appointment_confirmed", { appointment });
};
