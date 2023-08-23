const receitaModel = require('../models/receitaModel');

const exibirReceitas = (req, res) => {
  if (req.session.loggedin) {
    receitaModel.buscarReceitasPorUsuario(req.session.userId, (error, results) => {
      if (error) {
        console.error('Erro ao buscar as receitas:', error);
        return res.status(500).send('Erro interno ao carregar receitas.');
      }
      res.render('index', { receitas: results });
    });
  } else {
    res.redirect('/login');
  }
};

const renderizarFormulario = (req, res) => {
  if (req.session.loggedin) {
    res.render('criar-receita', { usuario_id: req.session.userId });
  } else {
    res.redirect('/login');
  }
};

const criarReceita = (req, res) => {
  const modoPreparo = req.body.modo_preparo;
  const listaModoPreparo = modoPreparo.split('\n').map(item => item.trim());

  const receitaData = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    ingredientes: req.body.ingredientes,
    modo_preparo: listaModoPreparo.join('\n'),
    usuario_id: req.session.userId,
    imagem: req.file ? req.file.filename : null,
  };

  receitaModel.criarReceita(receitaData, (error, novaReceitaId) => {
    if (error) {
      console.error('Erro ao criar a receita:', error);
      return res.status(500).send('Erro interno ao criar a receita.');
    }

    console.log('Nova receita criada com ID:', novaReceitaId);
    res.redirect(`/receitas/receita/${novaReceitaId}`);
  });
};

const exibirDetalhesReceita = (req, res) => {
  const receitaId = req.params.id;

  receitaModel.buscarReceitaPorId(receitaId, req.session.userId, (error, receita) => {
    if (error) {
      console.error('Erro ao buscar a receita:', error);
      return res.status(500).send('Erro interno ao carregar a receita.');
    }

    if (!receita || receita.usuario_id !== req.session.userId) {
      return res.status(404).send('Receita não encontrada ou não pertence ao usuário logado.');
    }

    res.render('detalhes-receita', { receita });
  });
};

const exibirFormularioEdicao = (req, res) => {
  const receitaId = req.params.id;

  receitaModel.buscarReceitaPorId(receitaId, req.session.userId, (error, receita) => {
    if (error) {
      console.error('Erro ao buscar a receita:', error);
      return res.status(500).send('Erro interno ao carregar a receita.');
    }

    if (!receita || receita.usuario_id !== req.session.userId) {
      return res.status(404).send('Receita não encontrada ou não pertence ao usuário logado.');
    }

    res.render('editar-receita', { receita });
  });
};

const atualizarReceita = (req, res) => {
  const receitaId = req.params.id;
  const modoPreparo = req.body.modo_preparo;

  receitaModel.buscarReceitaPorId(receitaId, req.session.userId, (error, receita) => {
    if (error) {
      console.error('Erro ao buscar a receita:', error);
      return res.status(500).send('Erro interno ao carregar a receita.');
    }

    if (!receita || receita.usuario_id !== req.session.userId) {
      return res.status(404).send('Receita não encontrada ou não pertence ao usuário logado.');
    }

    const receitaData = {
      titulo: req.body.titulo,
      ingredientes: req.body.ingredientes,
      descricao: req.body.descricao,
      modoPreparo: modoPreparo, 
    };

    if (req.file) {
      
      receitaData.imagem = req.file.filename;
    } else {
   
      receitaData.imagem = receita.imagem;
    }

    receitaModel.atualizarReceita(receitaId, receitaData, (error, result) => {
      if (error) {
        console.error('Erro ao atualizar a receita:', error);
        return res.status(500).send('Erro interno ao atualizar a receita.');
      }

      if (result === true) {
        console.log('Receita atualizada com sucesso.');
        res.redirect('/receitas/receita/' + receitaId);
      } else {
        res.status(404).send('Receita não encontrada ou não pertence ao usuário logado.');
      }
    });
  });
};

const excluirReceita = (req, res) => {
  const receitaId = req.params.id;

  receitaModel.excluirReceita(receitaId, req.session.userId, (error, result) => {
    if (error) {
      console.error('Erro ao excluir a receita:', error);
      return res.status(500).send('Erro interno ao excluir a receita.');
    }

    if (result === true) {
      console.log('Receita excluída com sucesso.');
      res.redirect('/receitas'); 
    } else {
      res.status(404).send('Receita não encontrada ou não pertence ao usuário logado.');
    }
  });
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
