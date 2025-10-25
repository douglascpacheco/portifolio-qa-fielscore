const { v4: uuidv4 } = require('uuid');

class Jogo {
  constructor({ id, data, categoria, adversario, local, competicao }) {
    this.id = id; // id curto
    this.data = data;
    this.categoria = categoria;
    this.adversario = adversario;
    this.local = local;
    this.competicao = competicao;
  }
}

module.exports = Jogo;
