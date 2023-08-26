const cadastroModel = require('../models/cadastroModel');
const express = require('express');
const router = express.Router();


const renderizarFormulario = (req, res) => {
  res.render('login', { showLogin: false });
};

const criarNovoUsuario = (req, res) => {
  const { nome, sobrenome, email, senha, data_nascimento } = req.body;

  if (!nome || !sobrenome || !email || !senha || !data_nascimento) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  cadastroModel.buscarUsuarioPorEmail(email, (err, usuarioExistente) => {
    if (err) {
      console.error('Erro ao verificar o email:', err);
      return res.status(500).send('Erro interno ao verificar o email.');
    }

    if (usuarioExistente) {
      return res.status(409).send('O email já está cadastrado.');
    }

    cadastroModel.criarNovoUsuarioNoBanco(nome, sobrenome, email, senha, data_nascimento, (err, novoUsuarioId) => {
      if (err) {
        console.error('Erro ao cadastrar o usuário:', err);
        return res.status(500).send('Erro interno ao cadastrar o usuário.');
      }

      console.log('Novo usuário cadastrado com ID:', novoUsuarioId);

      req.session.loggedin = true;
      req.session.userId = novoUsuarioId;
      res.redirect('/login');
    });
  });
};

module.exports = {
  renderizarFormulario,
  criarNovoUsuario,
};
