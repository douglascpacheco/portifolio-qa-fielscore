import http from 'k6/http';
import { sleep, check } from 'k6';
import { obterToken } from "../helpers/autenticacao.js"
import { pegarBaseURL } from '../utils/variaveis.js'

export const options = {

  //Teste de Carga
  stages: [
    { duration: '30s', target: 50 },
    { duration: '60s', target: 50 },
    { duration: '30s', target: 0 }
  ],
}

export default function () {

  const token = obterToken()

  const params = {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }

  let res = http.get(pegarBaseURL() + '/torcedores', params);

  check(res, {
    'Validar que o Status é 200': (r) => r.status === 200

  })

  sleep(1);
}
