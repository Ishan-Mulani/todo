import dotenv from "dotenv";

dotenv.config();

export const port = Number(process.env.PORT) || 3010;

export const dbHost = process.env.DBHOST;
export const dbUser = process.env.DBUSER;
export const dbPassword = process.env.DBPASSWORD;
export const dbDatabase = process.env.DBDATABASE;
export const dbPort = Number(process.env.DBPORT) || 5432;

export const jwtSecret = process.env.JWT_SECRET;
