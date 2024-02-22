const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "alejms11",
  database: "dindin",
});

module.exports = pool;
