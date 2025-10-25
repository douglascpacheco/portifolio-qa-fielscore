const db = require('../models/db');
const Torcedor = require('../models/torcedor');

function createTorcedor(data) {
  if (db.torcedores.find(t => t.email === data.email || t.nr_ft === data.nr_ft)) {
    throw { status: 409, message: 'Email ou nr_ft já cadastrado.' };
  }
  const torcedor = new Torcedor(data);
  db.torcedores.push(torcedor);
  return torcedor;
}

function getTorcedores(role, nr_ft) {
  if (role === 'admin') return db.torcedores;
  return db.torcedores.filter(t => t.nr_ft === nr_ft);
}

function getTorcedor(nr_ft, role, userNrFt) {
  if (role !== 'admin' && nr_ft !== userNrFt) throw { status: 403, message: 'Acesso negado.' };
  const torcedor = db.torcedores.find(t => t.nr_ft === nr_ft);
  if (!torcedor) throw { status: 404, message: 'Torcedor não encontrado.' };
  return torcedor;
}

function deleteTorcedor(nr_ft, role) {
  if (role !== 'admin') throw { status: 403, message: 'Apenas admin pode deletar torcedores.' };
  const idx = db.torcedores.findIndex(t => t.nr_ft === nr_ft);
  if (idx === -1) throw { status: 404, message: 'Torcedor não encontrado.' };
  db.torcedores.splice(idx, 1);
}

module.exports = { createTorcedor, getTorcedores, getTorcedor, deleteTorcedor };
