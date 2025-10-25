const torcedorService = require('../services/torcedorService');
const bcrypt = require('bcryptjs');

exports.create = async (req, res, next) => {
  try {
  const { nr_ft, nome, email, senha, role } = req.body;
  if (!nr_ft || !nome || !email || !senha) return res.status(400).json({ message: 'Campos obrigatórios.' });
  const hash = await bcrypt.hash(senha, 10);
  const torcedor = torcedorService.createTorcedor({ nr_ft, nome, email, senha: hash, role: role || 'torcedor' });
    res.status(201).json(torcedor);
  } catch (err) {
    next(err);
  }
};

exports.list = (req, res, next) => {
  try {
    const torcedores = torcedorService.getTorcedores(req.user.role, req.user.nr_ft);
    res.json(torcedores);
  } catch (err) {
    next(err);
  }
};

exports.get = (req, res, next) => {
  try {
    const torcedor = torcedorService.getTorcedor(req.params.nr_ft, req.user.role, req.user.nr_ft);
    res.json(torcedor);
  } catch (err) {
    next(err);
  }
};

exports.delete = (req, res, next) => {
  try {
    torcedorService.deleteTorcedor(req.params.nr_ft, req.user.role);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
