const loginModel = require("../models/loginModel");

const renderizarFormulario = (req, res) => {
  res.render("login", { showLogin: true });
};

const autenticarUsuario = (req, res) => {
  const { email, senha } = req.body;

  loginModel.verificarUsuario(email, senha, (err, results) => {
    if (err) {
      console.error("Erro ao verificar o usuário:", err);
      return res.status(500).send("Erro interno ao verificar o usuário.");
    }

    if (results.length === 0) {
      return res.render("login", { errorMessage: "Email ou senha inválidos." });
    }

    req.session.loggedin = true;
    req.session.userId = results[0].id;
    res.redirect("/receitas");
  });
};

module.exports = {
  renderizarFormulario,
  autenticarUsuario,
};
