const receitaModel = require("../models/receitaModel");

const exibirReceitas = (req, res) => {
  if (req.session.loggedin) {
    const flashMessage = req.flash("success");
    const flashError = req.flash("erro");
    const receitaExcluida = req.query.excluida === "true";
    const isSearchRequest = req.query.pesquisar !== undefined;

    receitaModel.buscarReceitasPorUsuario(
      req.session.userId,
      (error, results) => {
        if (error) {
          console.error("Erro ao buscar as receitas:", error);
          return res.status(500).send("Erro interno ao carregar receitas.");
        }

        res.render("index", {
          receitas: results,
          flash: { success: flashMessage, erro: flashError },
          receitaExcluida,
          isSearchRequest,
        });
      }
    );
  } else {
    res.redirect("/login");
  }
};

const renderizarFormulario = (req, res) => {
  if (req.session.loggedin) {
    res.render("criar-receita", {
      usuario_id: req.session.userId,
      flash: req.flash(),
    });
  } else {
    res.redirect("/login");
  }
};

const criarReceita = (req, res) => {
  const modoPreparo = req.body.modo_preparo;
  const listaModoPreparo = modoPreparo.split("\n").map((item) => item.trim());
  const tempoPreparo = req.body.tempo_preparo;
  const receitaData = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    ingredientes: req.body.ingredientes,
    modo_preparo: listaModoPreparo.join("\n"),
    usuario_id: req.session.userId,
    imagem: req.file ? req.file.filename : null,
    tempo_preparo: tempoPreparo,
  };

  receitaModel.verificarTituloExistentePorUsuario(
    receitaData.titulo,
    req.session.userId,
    (error, tituloExistente) => {
      if (error) {
        console.error("Erro ao verificar título existente:", error);
        return res.status(500).send("Erro interno ao criar a receita.");
      }

      if (tituloExistente) {
        req.flash(
          "erro",
          "Esse título já está em uso. Por favor, escolha outro."
        );
        return res.redirect("/receitas/criar-receita");
      }

      receitaModel.criarReceita(receitaData, (error, novaReceitaId) => {
        if (error) {
          console.error("Erro ao criar a receita:", error);
          req.flash("erro", "Houve um problema na criação de receita");
          return res.redirect("/receitas/criar-receita");
        }

        console.log("Nova receita criada com ID:", novaReceitaId);
        res.render("sucess");
      });
    }
  );
};

const exibirDetalhesReceita = (req, res) => {
  const receitaId = req.params.id;
  receitaModel.buscarReceitaPorId(
    receitaId,
    req.session.userId,
    (error, receita) => {
      if (error) {
        console.error("Erro ao buscar a receita:", error);
        return res.status(500).send("Erro interno ao carregar a receita.");
      }

      if (!receita || receita.usuario_id !== req.session.userId) {
        return res
          .status(404)
          .send("Receita não encontrada ou não pertence ao usuário logado.");
      }

      const formatDate = (dateString) => {
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        };
        const date = new Date(dateString);
        return date.toLocaleDateString("pt-BR", options);
      };

      const flashMessage = req.flash("success");

      res.render("detalhes-receita", { receita, formatDate, flashMessage });
    }
  );
};

const exibirFormularioEdicao = (req, res) => {
  const receitaId = req.params.id;

  receitaModel.buscarReceitaPorId(
    receitaId,
    req.session.userId,
    (error, receita) => {
      if (error) {
        console.error("Erro ao buscar a receita:", error);
        return res.status(500).send("Erro interno ao carregar a receita.");
      }

      if (!receita || receita.usuario_id !== req.session.userId) {
        return res
          .status(404)
          .send("Receita não encontrada ou não pertence ao usuário logado.");
      }

      res.render("editar-receita", { receita });
    }
  );
};

const atualizarReceita = (req, res) => {
  const receitaId = req.params.id;
  const modoPreparo = req.body.modo_preparo;

  receitaModel.buscarReceitaPorId(
    receitaId,
    req.session.userId,
    (error, receita) => {
      if (error) {
        console.error("Erro ao buscar a receita:", error);
        return res.status(500).send("Erro interno ao carregar a receita.");
      }

      if (!receita || receita.usuario_id !== req.session.userId) {
        return res
          .status(404)
          .send("Receita não encontrada ou não pertence ao usuário logado.");
      }

      const receitaData = {
        titulo: req.body.titulo,
        ingredientes: req.body.ingredientes,
        descricao: req.body.descricao,
        modoPreparo: modoPreparo,
        tempo_preparo: req.body.tempo_preparo,
      };

      if (req.file) {
        receitaData.imagem = req.file.filename;
      } else {
        receitaData.imagem = receita.imagem;
      }

      receitaModel.atualizarReceita(receitaId, receitaData, (error, result) => {
        if (error) {
          console.error("Erro ao atualizar a receita:", error);
          return res.status(500).send("Erro interno ao atualizar a receita.");
        }

        if (result === true) {
          req.flash("success", "Receita atualizada com sucesso.");

          res.redirect("/receitas/receita/" + receitaId);
        } else {
          res
            .status(404)
            .send("Receita não encontrada ou não pertence ao usuário logado.");
        }
      });
    }
  );
};

const excluirReceita = (req, res) => {
  const receitaId = req.params.id;
  receitaModel.excluirReceita(
    receitaId,
    req.session.userId,
    (error, result) => {
      if (error) {
        console.error("Erro ao excluir a receita:", error);
        return res.status(500).send("Erro interno ao excluir a receita.");
      }

      if (result === true) {
        console.log("Receita excluída com sucesso.");

        req.flash("erro", "Receita excluída com sucesso.");

        res.redirect("/receitas?excluida=true");
      } else {
        res
          .status(404)
          .send("Receita não encontrada ou não pertence ao usuário logado.");
      }
    }
  );
};

module.exports = {
  exibirReceitas,
  renderizarFormulario,
  criarReceita,
  exibirDetalhesReceita,
  exibirFormularioEdicao,
  atualizarReceita,
  excluirReceita,
};
