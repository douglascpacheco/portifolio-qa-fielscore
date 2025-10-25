const db = require('../models/db');
const Jogo = require('../models/jogo');

function isUniqueJogo(data) {
  return !db.jogos.find(j => j.data === data.data && j.categoria === data.categoria && j.adversario === data.adversario && j.local === data.local && j.competicao === data.competicao);
}

function createJogo(data, role) {
  if (role !== 'admin') throw { status: 403, message: 'Apenas admin pode criar jogos.' };
  if (!isUniqueJogo(data)) throw { status: 409, message: 'Jogo já cadastrado.' };
  const jogo = new Jogo(data);
  db.jogos.push(jogo);
  return jogo;
}

function getJogos(filters) {
  let jogos = db.jogos;
  if (filters) {
    if (filters.data) jogos = jogos.filter(j => j.data === filters.data);
    if (filters.competicao) jogos = jogos.filter(j => j.competicao === filters.competicao);
    if (filters.adversario) jogos = jogos.filter(j => j.adversario === filters.adversario);
  }
  return jogos;
}

function updateJogo(id, data, role) {
  if (role !== 'admin') throw { status: 403, message: 'Apenas admin pode atualizar jogos.' };
  const idx = db.jogos.findIndex(j => j.id === id);
  if (idx === -1) throw { status: 404, message: 'Jogo não encontrado.' };
  if (!isUniqueJogo(data)) throw { status: 409, message: 'Jogo já cadastrado.' };
  db.jogos[idx] = { ...db.jogos[idx], ...data };
  return db.jogos[idx];
}

function deleteJogo(id, role) {
  if (role !== 'admin') throw { status: 403, message: 'Apenas admin pode deletar jogos.' };
  const idx = db.jogos.findIndex(j => j.id === id);
  if (idx === -1) throw { status: 404, message: 'Jogo não encontrado.' };
  db.jogos.splice(idx, 1);
}

module.exports = { createJogo, getJogos, updateJogo, deleteJogo };
