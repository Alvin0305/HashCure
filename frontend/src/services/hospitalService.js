import axios from "./axiosInstance";

export const getAllDistricts = () => axios.get(`/api/hospitals/districts`);
export const getAllSpecialities = () =>
  axios.get(`/api/hospitals/specialities`);

export const getAllOwnershipTypes = () =>
  axios.get(`/api/hospitals/ownerships`);

export const getAllHospitals = (filterData) =>
  axios.post(`/api/hospitals/filter`, filterData);

export const getHospitalDetails = (id) => axios.get(`/api/hospitals/${id}`);

export const getHospitalComments = (id) =>
  axios.get(`/api/hospitals/comments/${id}`);

export const getUserRatingToHospital = (user_id, hospital_id) =>
  axios.post(`/api/hospitals/user/rating/${hospital_id}`, { user_id: user_id });

export const addHospitalComment = (hospital_id, comment, token) =>
  axios.post(
    `/api/hospitals/comments/${hospital_id}`,
    { comment: comment },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const rateHospital = (hospital_id, rating, token) =>
  axios.post(
    `/api/hospitals/rating/${hospital_id}`,
    { rating },
    { headers: { Authorization: `Bearer ${token}` } }
  );
