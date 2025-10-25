const db = require('../models/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

exports.login = async (req, res, next) => {
  try {
  const { email, password } = req.body;
  const torcedor = db.torcedores.find(t => t.email === email);
  if (!torcedor) return res.status(401).json({ message: 'Usuário não encontrado.' });
  const valid = await bcrypt.compare(password, torcedor.senha);
  if (!valid) return res.status(401).json({ message: 'Senha inválida.' });
  const token = generateToken(torcedor);
  res.json({ token });
  } catch (err) {
    next(err);
  }
};
