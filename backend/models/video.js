import pool from "../db.js";

export const addVideoFunction = async (doctor_id, video_url) => {
  const { rows } = await pool.query(
    `INSERT INTO
        doctor_videos (doctor_id, video_url)
        VALUES ($1, $2)
        RETURNING *`,
    [doctor_id, video_url]
  );
  return rows[0];
};

export const getVideosByDoctorFunction = async (doctor_id) => {
  const { rows } = await pool.query(
    `SELECT * FROM doctor_videos WHERE doctor_id = $1`,
    [doctor_id]
  );
  return rows;
};

export const getNewVideosFunction = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM doctor_videos 
    WHERE uploaded_at::date = CURRENT_DATE
      `
  );
  return rows;
};

export const deleteVideoFunction = async (id, url) => {
  const { rows } = await pool.query(
    `DELETE FROM doctor_videos 
    WHERE doctor_id = $1 
    AND video_url = $2
    RETURNING *`,
    [id, url]
  );
  return rows[0];
};
