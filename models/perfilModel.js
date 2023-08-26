const pool = require('../dbConfig');

const buscarUsuarioPorId = (userId, callback) => {
  pool.query('SELECT * FROM usuarios WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Erro ao buscar o usuário:', err);
      return callback(err, null);
    }

    if (results.length === 0) {
      return callback(null, null);
    }

    const usuario = results[0];
    callback(null, usuario);
  });
};

module.exports = {
  buscarUsuarioPorId,
};
