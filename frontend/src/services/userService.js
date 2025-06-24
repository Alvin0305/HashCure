import axios from "./axiosInstance";

export const getDonors = (donorData) =>
  axios.post(`/api/users/donors`, donorData);

export const getUserPreferences = (id) =>
  axios.get(`api/users/preferences/${id}`);

export const updateUserPreferences = (id, preferences) =>
  axios.put(`api/users/preferences/${id}`, preferences);

export const getConsultedDoctors = (id) => axios.get(`api/users/doctors/${id}`);

export const getVisitedHospitals = (id) =>
  axios.get(`api/users/hospitals/${id}`);

export const getUserNotifications = (token) =>
  axios.get(`/api/users/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getUserById = (id) => axios.get(`/api/users/${id}`);

export const updateUser = (id, userData) =>
  axios.put(`/api/users/${id}`, { userData });

export const updateUserImage = (id, formData) =>
  axios.put(`/api/users/upload/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
