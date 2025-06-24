import {
  addVideoFunction,
  deleteVideoFunction,
  getNewVideosFunction,
  getVideosByDoctorFunction,
} from "../models/video.js";

export const getNewVideos = async (req, res) => {
  try {
    const videos = await getNewVideosFunction();
    if (!videos) return res.status(400).json({ error: "Failed to get videos" });
    res.json(videos);
  } catch (err) {
    console.log("Failed to get videos");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getVideosByDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    const videos = await getVideosByDoctorFunction(id);
    if (!videos) return res.status(400).json({ error: "Failed to get videos" });
    res.json(videos);
  } catch (err) {
    console.log("Failed to get videos");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const addVideo = async (req, res) => {
  const doctor_id = req.user?.id;
  const { video_url } = req.body;

  try {
    const video = await addVideoFunction(doctor_id, video_url);
    if (!video) return res.status(400).json({ error: "Failed to add video" });
    res.json(video);
  } catch (err) {
    console.log("Failed to add video");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteVideo = async (req, res) => {
  const id = req.user?.id;
  const { video_url } = req.query;
  console.log(id, video_url);

  try {
    const video = await deleteVideoFunction(id, video_url);
    if (!video)
      return res.status(400).json({ error: "Failed to delete video" });
    res.json({ message: "video succesfully deleted" });
  } catch (err) {
    console.log("Failed to delete video");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// ------- completed not checked ---------
