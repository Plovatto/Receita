const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "./public/images/" });
const receitasController = require("../controllers/receitasController");

router.get("/receita/:id", receitasController.exibirDetalhesReceita);


router.get("/criar-receita", receitasController.renderizarFormulario);
router.post(
  "/criar-receita",
  upload.single("imagem"),
  receitasController.criarReceita
);

router.get("/receitas/listar-publicas", receitasController.listarReceitasPublicas);
router.get("/receitas/listar-privadas", receitasController.listarReceitasPrivadas);

router.get("/", receitasController.exibirReceitas);

router.get("/receita/editar/:id", receitasController.exibirFormularioEdicao);
router.post(
  "/receita/editar/:id",
  upload.single("imagem"),
  receitasController.atualizarReceita
);
router.post("/receita/:id/excluir", receitasController.excluirReceita);

module.exports = router;
