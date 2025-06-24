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

export const getHospitalByAdminId = (id) =>
  axios.get(`/api/hospitals/admin/${id}`);

export const getPatientsInHospital = (id, filterData) =>
  axios.post(`api/hospitals/patients/${id}`, filterData);

export const removeDoctorFromHospital = (id, doctor_id) =>
  axios.delete(`api/hospitals/doctor/${id}`, { params: { doctor_id } });

export const addDoctorToHospital = (id, data) =>
  axios.post(`api/hospitals/doctor/${id}`, data);

export const uploadHospitalImage = (hospital_id, formData) =>
  axios.put(`/api/hospitals/upload/${hospital_id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getHospitalById = (id) => axios.get(`/api/hospitals/${id}`);

export const updateHospital = (id, data) =>
  axios.put(`/api/hospitals/${id}`, data);

export const addHospitalSpeciality = (id, name) =>
  axios.post(`/api/hospitals/specialities/${id}`, { speciality: name });

export const removeHospitalSpeciality = (id, name) =>
  axios.delete(`/api/hospitals/specialities/${id}`, {
    params: { speciality: name },
  });
