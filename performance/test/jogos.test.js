import http from 'k6/http';
import { sleep, check } from 'k6';
import { obterToken } from "../helpers/autenticacao.js"
import { pegarBaseURL } from '../utils/variaveis.js'

export const options = {

  //Teste de Stress
  stages: [
    { duration: '50s', target: 100 },
    { duration: '100s', target: 100 },
    { duration: '50s', target: 0 }
  ],
}

export default function () {

  const token = obterToken()

  const params = {
    headers: {
      'Authorization': `Bearer ${token}`
    },
  }

  let res = http.get(pegarBaseURL() + '/jogos', params);

  check(res, {
    'Validar que o Status é 200': (r) => r.status === 200

  })

  sleep(1);
}
