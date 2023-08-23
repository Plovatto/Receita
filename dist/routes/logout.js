const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Erro ao fazer logout:', err);
      return res.status(500).send('Erro interno ao fazer logout.');
    }
    res.redirect('/login');
  });
});

module.exports = router;
