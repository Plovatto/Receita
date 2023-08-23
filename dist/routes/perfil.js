const express = require('express');
const router = express.Router();
const perfilModel = require('../models/perfilModel');

router.get('/', (req, res) => {
  const usuarioLogado = req.session.userId;

  if (!usuarioLogado) {
    return res.redirect('/login');
  }

  perfilModel.buscarUsuarioPorId(usuarioLogado, (err, usuario) => {
    if (err || !usuario) {
      console.error('Erro ao buscar o usuário:', err);
      return res.status(500).send('Erro interno ao buscar o usuário.');
    }

    const formatarData = (data) => {
      const opcoes = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(data).toLocaleDateString('pt-BR', opcoes);
    };

    res.render('perfil', { usuario, formatarData });
  });
});

module.exports = router;
