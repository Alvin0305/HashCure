import axios from "./axiosInstance";

export const getUserDiseases = (id, token) =>
  axios.get(`/api/diseases/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getDiseaseDetails = (user_id, disease_id, token) =>
  axios.post(
    `/api/diseases/disease/${user_id}`,
    { disease_id: disease_id },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const addANewDiseaseValue = (user_id, data, token) =>
  axios.post(`/api/diseases/value/${user_id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addANewDiseaseReport = (user_id, formData) =>
  axios.post(`/api/diseases/report/${user_id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const addANewMedicine = (user_id, data) =>
  axios.post(`/api/diseases/medicine/${user_id}`, data);

export const addANewDisease = (user_id, name, token) =>
  axios.post(
    `/api/diseases/${user_id}`,
    { name },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const removeADiseaseValue = (user_id, disease_id, record_date, token) =>
  axios.delete(`/api/diseases/value/${user_id}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { disease_id, record_date },
  });

export const updateNormalValuesOfDisease = (
  user_id,
  disease_id,
  min_value,
  max_value,
  token
) =>
  axios.put(
    `/api/diseases/normal/${user_id}`,
    { disease_id, min_value, max_value },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const removeAMedicine = (user_id, disease_id, name) =>
  axios.delete(`/api/diseases/medicine/${user_id}`, {
    params: { disease_id, name },
  });

export const removeADisease = (user_id, disease_id) =>
  axios.delete(`/api/diseases/${user_id}`, { params: { disease_id } });
