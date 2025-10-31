const request = require('supertest');
const postLogin = require('../fixtures/postLogin.json')

const obterToken = async (usuario, senha) => {
const bodyLogin = { ...postLogin }

    const respostaLogin = await request(process.env.BASE_URL)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send(bodyLogin)

    return respostaLogin.body.token
}

module.exports = {
    obterToken
}