import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: "foodly",
  })
  .promise();

async function getData() {
  const [rows] = await pool.query("select * from user where id = 1");
  return rows;
}

const users = await getData();
console.log(users);
