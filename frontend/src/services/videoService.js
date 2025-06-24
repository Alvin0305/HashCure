import axios from "./axiosInstance";

export const getNewVideos = () => axios.get(`/api/videos/new`);

export const getVideosByDoctor = (id) => axios.get(`/api/videos/${id}`);

export const addVideo = (video_url, token) =>
  axios.post(
    `/api/videos`,
    { video_url },
    { headers: { Authorization: `Bearer ${token}` } }
  );

export const deleteVideo = (video_url, token) =>
  axios.delete(`/api/videos`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { video_url },
  });
