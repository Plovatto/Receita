const connection = require('../dbConfig');
const crypto = require('crypto');

const findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    connection.query(query, [email], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const updateUserCode = async (email, code) => {
  await connection.query('UPDATE usuarios SET codigo_confirmacao = ? WHERE email = ?', [code, email]);
};

const updateUserPassword = async (email, newPassword) => {
  try {
    
    const md5Hash = crypto.createHash('md5').update(newPassword).digest('hex');

    await connection.query('UPDATE usuarios SET senha = ? WHERE email = ?', [md5Hash, email]);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findByEmail,
  updateUserCode,
  updateUserPassword,
};
