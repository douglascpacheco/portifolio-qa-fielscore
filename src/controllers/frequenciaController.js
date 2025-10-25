const frequenciaService = require('../services/frequenciaService');

exports.create = (req, res, next) => {
  try {
    const { id_jogo, nr_ft, valor_pago } = req.body;
    const frequencia = frequenciaService.createFrequencia({ id_jogo, nr_ft, valor_pago }, req.user.role, req.user.nr_ft);
    res.status(201).json(frequencia);
  } catch (err) {
    next(err);
  }
};

exports.list = (req, res, next) => {
  try {
    const { torcedorId, includeStats } = req.query;
    if (!torcedorId) return res.status(400).json({ message: 'torcedorId obrigatório.' });
    const frequencias = frequenciaService.getFrequencias(torcedorId);
    if (includeStats === 'true') {
      const stats = frequenciaService.getStats(torcedorId);
      return res.json({ frequencias, ...stats });
    }
    res.json({ frequencias });
  } catch (err) {
    next(err);
  }
};
