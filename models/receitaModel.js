const pool = require("../dbConfig");

const pesquisarReceitasPorTitulo = (titulo, callback) => {
  const searchTerm = `%${titulo}%`;
  pool.query(
    "SELECT * FROM receitas WHERE titulo LIKE ?",
    [searchTerm],
    (error, results) => {
      if (error) {
        console.error("Erro na consulta ao banco de dados:", error);
        return callback(error, null);
      }
      callback(null, results);
    }
  );
};

const buscarReceitasPorUsuario = (usuarioId, callback) => {
  pool.query(
    "SELECT * FROM receitas WHERE usuario_id = ? ORDER BY data_criacao DESC, id DESC",
    [usuarioId],
    (error, results) => {
      if (error) {
        console.error("Erro na consulta ao banco de dados:", error);
        return callback(error, null);
      }
      callback(null, results);
    }
  );
};

const buscarReceitaPorTitulo = (titulo, callback) => {
  pool.query(
    "SELECT * FROM receitas WHERE titulo = ?",
    [titulo],
    (error, results) => {
      if (error) {
        console.error("Erro na consulta ao banco de dados:", error);
        return callback(error, null);
      }

      const receita = results[0];
      callback(null, receita);
    }
  );
};

const criarReceita = (receitaData, callback) => {
  const {
    titulo,
    descricao,
    ingredientes,
    modo_preparo,
    usuario_id,
    imagem,
    tempo_preparo,
  } = receitaData;

  const query = `
    INSERT INTO receitas (titulo, descricao, ingredientes, modo_preparo, usuario_id, imagem, tempo_preparo)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  const values = [
    titulo,
    descricao,
    ingredientes,
    modo_preparo,
    usuario_id,
    imagem,
    tempo_preparo,
  ];

  pool.query(query, values, (error, results) => {
    if (error) {
      console.error("Erro na inserção da receita:", error);
      return callback(error, null);
    }

    const novaReceitaId = results.insertId;
    callback(null, novaReceitaId);
  });
};

const buscarReceitaPorId = (receitaId, usuarioId, callback) => {
  pool.query(
    "SELECT * FROM receitas WHERE id = ? AND usuario_id = ?",
    [receitaId, usuarioId],
    (error, results) => {
      if (error) {
        console.error("Erro na consulta ao banco de dados:", error);
        return callback(error, null);
      }

      if (results.length === 0) {
        return callback(
          "Receita não encontrada ou não pertence ao usuário logado.",
          null
        );
      }

      const receita = results[0];
      callback(null, receita);
    }
  );
};

const excluirReceita = (receitaId, usuarioId, callback) => {
  pool.query(
    "DELETE FROM receitas WHERE id = ? AND usuario_id = ?",
    [receitaId, usuarioId],
    (error, result) => {
      if (error) {
        console.error("Erro na consulta ao banco de dados:", error);
        return callback(error, null);
      }

      if (result.affectedRows === 0) {
        return callback(
          "Receita não encontrada ou não pertence ao usuário logado.",
          null
        );
      }

      callback(null, true);
    }
  );
};

const atualizarReceita = (receitaId, receitaData, callback) => {
  const {
    titulo,
    descricao,
    ingredientes,
    modoPreparo,
    imagem,
    tempo_preparo,
  } = receitaData;

  const query =
    "UPDATE receitas SET titulo = ?, descricao = ?, ingredientes = ?, modo_preparo = ?, imagem = ?, tempo_preparo = ? WHERE id = ?";
  const values = [
    titulo,
    descricao,
    ingredientes,
    modoPreparo,
    imagem,
    tempo_preparo,
    receitaId,
  ];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error("Erro na consulta ao banco de dados:", error);
      return callback(error, null);
    }

    if (result.affectedRows === 0) {
      return callback(
        "Receita não encontrada ou não pertence ao usuário logado.",
        null
      );
    }

    callback(null, true);
  });
};

const verificarTituloExistentePorUsuario = (titulo, usuario_id, callback) => {
  const query =
    "SELECT COUNT(*) AS count FROM receitas WHERE titulo = ? AND usuario_id = ?";
  pool.query(query, [titulo, usuario_id], (error, results) => {
    if (error) {
      return callback(error, null);
    }
    callback(null, results[0].count > 0);
  });
};

module.exports = {
  buscarReceitasPorUsuario,
  criarReceita,
  buscarReceitaPorId,
  excluirReceita,
  pesquisarReceitasPorTitulo,
  buscarReceitaPorTitulo,
  atualizarReceita,
  verificarTituloExistentePorUsuario,
};
