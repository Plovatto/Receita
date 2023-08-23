const express = require('express');
const router = express.Router();
const cadastroModel = require('../models/perfilModel');

router.get('/perfil', (req, res) => {
  const usuarioLogado = req.session.userId;

  if (!usuarioLogado) {
    return res.redirect('/login');
  }

  cadastroModel.buscarUsuarioPorId(usuarioLogado, (err, usuario) => {
    if (err || !usuario) {
      console.error('Erro ao buscar o usuário:', err);
      return res.status(500).send('Erro interno ao buscar o usuário.');
    }

    function formatarData(data) {
      const opcoes = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(data).toLocaleDateString('pt-BR', opcoes);
    }

    res.render('perfil', { usuario, formatarData });
  });
});

module.exports = router;
