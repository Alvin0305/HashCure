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
