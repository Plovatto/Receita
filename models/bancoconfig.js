const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "sql10.freemysqlhosting.net",
  user: "sql10643420",
  password: "dpvdCYe7vL",
  database: "sql10643420",
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Erro ao conectar com o banco:", err);
    return;
  }
  console.log("Conexão com o banco de dados estabelecida.");
  connection.release();
});

module.exports = pool;
