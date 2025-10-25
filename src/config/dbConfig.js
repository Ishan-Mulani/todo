import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import { dbDatabase, dbUser, dbPassword, dbHost, dbPort } from "./envConfig.js";

dotenv.config();

const sequelize = new Sequelize(dbDatabase, dbUser, dbPassword, {
  host: dbHost,
  dialect: "postgres",
  port: dbPort,
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL via Sequelize");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

export default sequelize;
