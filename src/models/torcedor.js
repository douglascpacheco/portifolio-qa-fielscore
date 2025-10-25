const { v4: uuidv4 } = require('uuid');

class Torcedor {
  constructor({ nr_ft, nome, email, senha, role = 'torcedor' }) {
    this.id = nr_ft; // id curto, igual ao nr_ft
    this.nr_ft = nr_ft;
    this.nome = nome;
    this.email = email;
    this.senha = senha; // hash
    this.role = role;
  }
}

module.exports = Torcedor;
