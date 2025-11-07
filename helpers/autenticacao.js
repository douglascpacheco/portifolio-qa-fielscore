const request = require('supertest');

const obterToken = async (usuario, senha) => {
    const bodyLogin = {
        email: usuario,
        password: senha
    }

    const respostaLogin = await request(process.env.BASE_URL)
        .post('/auth/login')
        .set('Content-Type', 'application/json')
        .send(bodyLogin)

    console.log('Login response body:', respostaLogin.body)

    return respostaLogin.body.token
}

module.exports = {
    obterToken
}