require("dotenv").config();

module.exports = {
  development: {
    dialect: process.env.DB_DIALECT || "mysql",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || "investpro",
    username: process.env.DB_USER || "invest",
    password: process.env.DB_PASSWORD || "invest",
    storage: process.env.DB_STORAGE || "./dev.sqlite",
    logging: false,
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  },
  production: {
    dialect: process.env.DB_DIALECT || "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: false,
  },
};
