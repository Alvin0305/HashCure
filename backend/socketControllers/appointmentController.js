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
  console.log(appt);
  const { rows } = await pool.query(
    `UPDATE appointments
        SET status = 'Cancelled' 
        WHERE id = $1
        RETURNING *`,
    [appt.id]
  );

  const { rows: patient } = await pool.query(
    `SELECT firstname, lastname FROM users WHERE id = $1`,
    [appt.patient_id]
  );

  const notiticationForPatient = `Your appointment with Dr. ${
    appt.doctor_name
  } in ${appt.hospital_name}, on ${new Date(
    appt.time
  ).toDateString()} at ${new Date(appt.time).toLocaleTimeString("default", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })} is cancelled. Thanks for using the application.`;

  const notiticationForDoctor = `Your appointment with ${
    patient[0].firstname
  } ${patient[0].lastname} in ${appt.hospital_name}, on ${new Date(
    appt.time
  ).toDateString()} at ${new Date(appt.time).toLocaleTimeString("default", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })} is cancelled. Thanks for using the application.`;

  const { rows: notification } = await pool.query(
    `INSERT INTO notifications(user_id, content) 
    VALUES ($1, $2), ($3, $4)
    RETURNING *`,
    [
      appt.patient_id,
      notiticationForPatient,
      appt.doctor_id,
      notiticationForDoctor,
    ]
  );

  const appointment = rows[0];

  io.to(`user_${appt.patient_id}`).emit("appointment_cancelled", {
    appointment,
    notification: notification[0],
  });
  console.log("sending signal to doctor", appt.doctor_id);
  io.to(`user_${appt.doctor_id}`).emit("appointment_cancelled", {
    appointment,
    notification: notification[1],
  });
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

  const { rows: patient } = await pool.query(
    `SELECT firstname, lastname FROM users WHERE id = $1`,
    [appt.patient_id]
  );

  const notiticationForPatient = `Your appointment with Dr. ${
    appt.doctor_name
  } in ${appt.hospital_name}, on ${new Date(
    appt.time
  ).toDateString()} at ${new Date(appt.time).toLocaleTimeString("default", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })} has been confirmed. Thanks for using the application.`;

  const notiticationForDoctor = `Your have an appointment with ${
    patient[0].firstname
  } ${patient[0].lastname} in ${appt.hospital_name}, on ${new Date(
    appt.time
  ).toDateString()} at ${new Date(appt.time).toLocaleTimeString("default", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}. Thanks for using the application.`;

  const { rows: notification } = await pool.query(
    `INSERT INTO notifications(user_id, content) 
    VALUES ($1, $2), ($3, $4)
    RETURNING *`,
    [
      appt.patient_id,
      notiticationForPatient,
      appt.doctor_id,
      notiticationForDoctor,
    ]
  );

  io.to(`user_${appt.patient_id}`).emit("appointment_confirmed", {
    appointment,
    notification: notification[0],
  });
  io.to(`user_${appt.doctor_id}`).emit("appointment_confirmed", {
    appointment,
    notification: notification[1],
  });
};
