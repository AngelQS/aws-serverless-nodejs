import { Sequelize } from "sequelize"

export const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.MYSQL_DB_HOST,
    port: Number(process.env.MYSQL_DB_PORT),
    username: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_SCHEMA,
    // sync: true,
    // logging: true,
})