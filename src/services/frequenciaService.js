const db = require('../models/db');
const Frequencia = require('../models/frequencia');

function calcPontuacao(jogo, tipo_ingresso) {
  let base = 10;
  if (tipo_ingresso === 'FT') base += 10;
  else if (tipo_ingresso === 'inteira') base += 5;
  // meia mantém apenas os 10 pontos
  return base;
}

function createFrequencia(data, role, userNrFt) {
  const jogo = db.jogos.find(j => j.id === data.id_jogo);
  if (!jogo) throw { status: 404, message: 'Jogo não encontrado.' };
  const frequenciaExistente = db.frequencias.find(f => f.nr_ft === (role === 'admin' ? data.nr_ft : userNrFt) && f.id_jogo === data.id_jogo);
  if (frequenciaExistente) throw { status: 409, message: 'Frequência já registrada.' };
  if (role !== 'admin' && data.nr_ft !== userNrFt) throw { status: 403, message: 'Acesso negado.' };
  const pontuacao = calcPontuacao(jogo, data.tipo_ingresso);
  const frequencia = new Frequencia({ id_jogo: data.id_jogo, nr_ft: role === 'admin' ? data.nr_ft : userNrFt, tipo_ingresso: data.tipo_ingresso, valor_pago: data.valor_pago, pontuacao });
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
  if (pontuacao_total > 30 && pontuacao_total <= 60) categoria_fidelidade = 'Pacaembu';
  if (pontuacao_total > 60) categoria_fidelidade = 'Itaquera';
  return { total_jogos, pontuacao_total, categoria_fidelidade };
}

module.exports = { createFrequencia, getFrequencias, getStats };
