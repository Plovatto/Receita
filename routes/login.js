const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

router.get("/", loginController.renderizarFormulario);
router.post("/submit", loginController.autenticarUsuario);

module.exports = router;
