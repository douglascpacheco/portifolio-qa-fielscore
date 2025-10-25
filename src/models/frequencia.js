const { v4: uuidv4 } = require('uuid');

class Frequencia {
  constructor({ id_jogo, nr_ft, tipo_ingresso, valor_pago, pontuacao }) {
    this.id = uuidv4();
    this.id_jogo = id_jogo;
    this.nr_ft = nr_ft;
    this.tipo_ingresso = tipo_ingresso;
    this.valor_pago = valor_pago;
    this.pontuacao = pontuacao;
  }
}

module.exports = Frequencia;
