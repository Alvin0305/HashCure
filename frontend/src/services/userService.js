import axios from "./axiosInstance";

export const getDonors = (donorData) =>
  axios.post(`/api/users/donors`, donorData);
