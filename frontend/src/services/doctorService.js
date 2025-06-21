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
