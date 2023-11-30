const pool = require("../models/bancoconfig");
const crypto = require("crypto");

const criarNovoUsuarioNoBanco = (
  nome,
  sobrenome,
  email,
  senha,
  dataNascimento,
  callback
) => {
  const md5Hash = crypto.createHash("md5");
  const hashedSenha = md5Hash.update(senha).digest("hex");

  pool.query(
    "INSERT INTO usuarios (nome, sobrenome, email, senha, data_nascimento) VALUES (?, ?, ?, ?, ?)",
    [nome, sobrenome, email, hashedSenha, dataNascimento],
    (err, result) => {
      if (err) {
        console.error("Erro ao cadastrar o usuário:", err);
        return callback(err, null);
      }

      console.log(
        "Novo usuário cadastrado com ID:",
        result.insertId,
        nome,
        sobrenome,
        email,
        hashedSenha,
        dataNascimento
      );
      callback(null, result.insertId);
    }
  );
};

const buscarUsuarioPorEmail = (email, callback) => {
  pool.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("Erro ao buscar o usuário:", err);
        return callback(err, null);
      }

      if (results.length === 0) {
        return callback(null, null);
      }

      const usuario = results[0];
      callback(null, usuario);
    }
  );
};

module.exports = {
  criarNovoUsuarioNoBanco,
  buscarUsuarioPorEmail,
};
