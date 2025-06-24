import axios from "./axiosInstance";

export const getFixedAppointments = (doctor_id, week_start_date) =>
  axios.post(`/api/appointments/all/${doctor_id}`, { week_start_date });

export const createAppointment = (appointmentData, token) =>
  axios.post(`/api/appointments`, appointmentData, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAppointmentsByUser = (user_id, filterData) =>
  axios.post(`/api/appointments/patient/${user_id}`, filterData);

export const getAppointmentsByDoctor = (doctor_id, filterData) =>
  axios.post(`/api/appointments/doctor/${doctor_id}`, filterData);

export const cancelAppointmentsByUser = (id, token) =>
  axios.put(
    `/api/appointments/cancel/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const deleteAppointmentsByUser = (id, token) =>
  axios.delete(`/api/appointments/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateAppointment = (id, token, data) =>
  axios.put(`/api/appointments/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
