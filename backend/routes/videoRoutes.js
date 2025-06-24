import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addVideo,
  deleteVideo,
  getNewVideos,
  getVideosByDoctor,
} from "../controllers/videoController.js";

const router = express.Router();

router.post("/", protect, addVideo);
router.get("/new", getNewVideos);
router.get("/:id", getVideosByDoctor);
router.delete("/", protect, deleteVideo);

export default router;
