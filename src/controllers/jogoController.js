const jogoService = require('../services/jogoService');

exports.create = (req, res, next) => {
  try {
    const { data, categoria, adversario, local, competicao } = req.body;
    if (!data || !categoria || !adversario || !local || !competicao) return res.status(400).json({ message: 'Campos obrigatórios.' });
    const jogo = jogoService.createJogo({ data, categoria, adversario, local, competicao }, req.user.role);
    res.status(201).json(jogo);
  } catch (err) {
    next(err);
  }
};

exports.list = (req, res, next) => {
  try {
    const jogos = jogoService.getJogos(req.query);
    res.json(jogos);
  } catch (err) {
    next(err);
  }
};

exports.update = (req, res, next) => {
  try {
    const jogo = jogoService.updateJogo(req.params.id, req.body, req.user.role);
    res.json(jogo);
  } catch (err) {
    next(err);
  }
};

exports.delete = (req, res, next) => {
  try {
    jogoService.deleteJogo(req.params.id, req.user.role);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
