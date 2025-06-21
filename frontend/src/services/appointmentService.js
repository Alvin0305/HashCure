import axios from "./axiosInstance";

export const getFixedAppointments = (doctor_id, week_start_date) =>
  axios.post(`/api/appointments/all/${doctor_id}`, { week_start_date });

export const createAppointment = (appointmentData, token) =>
  axios.post(`/api/appointments`, appointmentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
