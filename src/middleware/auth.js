const jwt = require('jsonwebtoken');
const db = require('../models/db');

const SECRET = 'fielscore_secret';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token não fornecido.' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido.' });
    const torcedor = db.torcedores.find(t => t.nr_ft === decoded.nr_ft);
    if (!torcedor) return res.status(401).json({ message: 'Usuário não encontrado.' });
    req.user = { nr_ft: torcedor.nr_ft, role: torcedor.role };
    next();
  });
}

function generateToken(torcedor) {
  return jwt.sign({ nr_ft: torcedor.nr_ft, role: torcedor.role }, SECRET, { expiresIn: '1d' });
}

module.exports = { authenticate, generateToken };
