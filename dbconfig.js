const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 10, 
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'receitas',
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar com o banco:', err);
    return;
  }
  console.log('Conexão com o banco de dados estabelecida.');
  connection.release();
});

module.exports = pool;
