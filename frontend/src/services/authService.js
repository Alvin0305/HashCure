import axios from "./axiosInstance";

export const loginUser = (userData) => axios.post("/api/auth/login", userData);

export const registerUser = (userData) =>
  axios.post("/api/auth/register", userData);
