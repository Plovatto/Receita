
const mysql = require('mysql');
//conexão
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'receitas',
});
connection.connect((err) => {
  if (err) {
    console.error('erro ao conectar com o banco:', err);
    return;
  }
  console.log('Banco de dados conectado.');
});
module.exports = connection;
