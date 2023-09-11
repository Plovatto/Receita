const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "sql10.freemysqlhosting.net",
  user: "sql10645717",
  password: "iKIjxEIB6v",
  database: "sql10645717",
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
