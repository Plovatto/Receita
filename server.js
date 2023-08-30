const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const expressLayouts = require("express-layouts");
const path = require("path");
const router = express.Router();
const app = express();
const port = 3300;
const flash = require("express-flash");
require("dotenv").config();

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "dist")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "mysecretkey",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/", (req, res) => {
  res.render("inicio", {});
});
router.get("/login", (req, res) => {
  res.render("login", { showLogin: true });
});
router.get("/cadastro", (req, res) => {
  res.render("login", { showLogin: false });
});
router.get("/sucess", (req, res) => {
  res.render("sucess");
});

const cadastroRoutes = require("./routes/cadastro");
const loginRoutes = require("./routes/login");
const logoutRoutes = require("./routes/logout");
const receitasRoutes = require("./routes/receitas");
const perfilRoutes = require("./routes/perfil");
const redefinirRoutes = require("./routes/redefinir");

app.use("/perfil", perfilRoutes);
app.use("/cadastro", cadastroRoutes);
app.use("/login", loginRoutes);
app.use("/logout", logoutRoutes);
app.use("/receitas", receitasRoutes);
app.use("/redefinir", redefinirRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://127.0.0.1:${port}`);
});
