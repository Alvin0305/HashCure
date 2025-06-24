import axios from "./axiosInstance";

export const getAllSpecializations = () =>
  axios.get(`/api/doctors/specializations`);

export const getDoctors = (filterData) =>
  axios.post(`/api/doctors/filter`, filterData);

export const getDoctorById = (id) => axios.get(`/api/doctors/${id}`);

export const getDoctorComments = (id) =>
  axios.get(`/api/doctors/comments/${id}`);

export const addDoctorComments = (doctor_id, comment, token) =>
  axios.post(
    `/api/doctors/comments`,
    {
      doctor_id: doctor_id,
      comment: comment,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const rateDoctor = (doctor_id, rating, token) =>
  axios.post(
    `/api/doctors/rating`,
    { doctor_id, rating },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const getUserRatingToDoctor = (user_id, doctor_id) =>
  axios.post(`/api/doctors/user/rating/${doctor_id}`, { user_id: user_id });

export const getDoctorWorkingHours = (id) =>
  axios.get(`/api/doctors/schedule/${id}`);

export const getPatients = (id, data, token) =>
  axios.post(`/api/doctors/patients/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateDoctor = (id, doctorData) =>
  axios.put(`/api/doctors/${id}`, { doctorData });

export const addSpecializationForDoctor = (id, spec, token) =>
  axios.post(
    `/api/doctors/specialization/${id}`,
    { specialization: spec },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const removeSpecializationForDoctor = (id, spec, token) =>
  axios.delete(`/api/doctors/specialization/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { specialization: spec },
  });

export const addDoctorWorkingHour = (id, data, token) =>
  axios.post(`/api/doctors/schedule/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const removeDoctorWorkingHour = (id, data) =>
  axios.delete(`/api/doctors/schedule/${id}`, {
    params: data,
  });

export const editDoctorWorkingHour = (id, data) =>
  axios.put(`/api/doctors/schedule/${id}`, data);
