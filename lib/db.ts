import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

const dbName = process.env.DB_NAME || "students";
const dbUser = process.env.DB_USER || "root";
const dbPassword = process.env.DB_PASSWORD || "";
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = parseInt(process.env.DB_PORT || "3306", 10);

declare global {
  // eslint-disable-next-line no-var
  var __sequelizeInstance: Sequelize | undefined;
}

export const sequelize =
  global.__sequelizeInstance ||
  new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: "mysql",
    dialectModule: mysql2,
    logging: process.env.NODE_ENV === "development" ? false : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.__sequelizeInstance = sequelize;
}
