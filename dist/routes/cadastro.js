const express = require('express');
const router = express.Router();
const cadastroController = require('../controllers/cadastroController');


router.get('/', cadastroController.renderizarFormulario);

router.post('/submit', cadastroController.criarNovoUsuario);

module.exports = router;
