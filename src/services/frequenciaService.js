const db = require('../models/db');
const Frequencia = require('../models/frequencia');

function calcPontuacao(jogo, tipo_ingresso) {
  let base = 10;
  if (jogo.categoria === 'especial') base += 10;
  if (tipo_ingresso === 'vip') base += 5;
  return base;
}

function createFrequencia(data, role, userNrFt) {
  const jogo = db.jogos.find(j => j.id === data.id_jogo);
  if (!jogo) throw { status: 404, message: 'Jogo não encontrado.' };
  const frequenciaExistente = db.frequencias.find(f => f.nr_ft === (role === 'admin' ? data.nr_ft : userNrFt) && f.id_jogo === data.id_jogo);
  if (frequenciaExistente) throw { status: 409, message: 'Frequência já registrada.' };
  const dataJogo = new Date(jogo.data);
  const hoje = new Date();
  const diff = (hoje - dataJogo) / (1000 * 60 * 60 * 24);
  if (diff > 30) throw { status: 400, message: 'Data do jogo não pode ser mais de 30 dias anterior à data atual.' };
  if (role !== 'admin' && data.nr_ft !== userNrFt) throw { status: 403, message: 'Acesso negado.' };
  const pontuacao = 10;
  const frequencia = new Frequencia({ id_jogo: data.id_jogo, nr_ft: role === 'admin' ? data.nr_ft : userNrFt, valor_pago: data.valor_pago, pontuacao });
  db.frequencias.push(frequencia);
  return frequencia;
}

function getFrequencias(nr_ft) {
  return db.frequencias.filter(f => f.nr_ft === nr_ft);
}

function getStats(nr_ft) {
  const frequencias = getFrequencias(nr_ft);
  const total_jogos = db.jogos.length;
  const pontuacao_total = frequencias.reduce((acc, f) => acc + f.pontuacao, 0);
  let categoria_fidelidade = 'Fazendinha';
  if (pontuacao_total > 100 && pontuacao_total <= 200) categoria_fidelidade = 'Pacaembu';
  if (pontuacao_total > 200) categoria_fidelidade = 'Itaquera';
  return { total_jogos, pontuacao_total, categoria_fidelidade };
}

module.exports = { createFrequencia, getFrequencias, getStats };
