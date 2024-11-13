import { Pool } from "pg";

// Create a pool instance for connection reuse
export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
});

export default async function dbConnect() {
  await pool.connect((err, client, release) => {
    if (err) {
      return console.error("error in connection", err.stack);
    }
    client.query("SELECT NOW()", (err, result) => {
      release();
      if (err) {
        return console.error("error in query exucation", err.stack);
      }
      console.log("connected to database");
    });
  });
}
