const pool = require("../dbConfig");
const crypto = require("crypto");

const verificarUsuario = (email, senha, callback) => {
  const md5Hash = crypto.createHash("md5");
  const hashedSenha = md5Hash.update(senha).digest("hex");
  const query = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
  pool.query(query, [email, hashedSenha], callback);
  console.log("Usuário logado com", email, hashedSenha);
};

module.exports = {
  verificarUsuario,
};
