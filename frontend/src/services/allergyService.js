import axios from "./axiosInstance";

export const addAllergy = (user_id, name) =>
  axios.post(`/api/allergies/${user_id}`, { name });

export const removeAllergy = (user_id, name) =>
  axios.delete(`/api/allergies/${user_id}`, { params: { name } });
