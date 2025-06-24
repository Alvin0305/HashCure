import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("Connected to PostgreSQL");

  const { rows } = pool.query(`SELECT * FROM users`);
  console.log("here");
  console.log(rows);
});

export default pool;
