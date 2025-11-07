const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config()
const { usuarioValido, usuarioInvalido, senhaInvalida } = require('../fixtures/postLogin.json')


describe('Login', () => {
    describe('POST /auth/login', () => {
        it('Deve retornar 200 ao autenticar com credenciais válidas', async () => {
            const resposta = await request(process.env.BASE_URL)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send(usuarioValido)

            expect(resposta.status).to.be.equal(200)
            expect(resposta.body.token).to.be.a('string');
        })

        it('Deve retornar 404 ao tentar autenticar com usuário não cadastrado', async () => {
            const resposta = await request(process.env.BASE_URL)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send(usuarioInvalido)

            expect(resposta.status).to.be.equal(404)
            expect(resposta.body).to.have.property('message', 'Usuário não encontrado.')
        })

        it('Deve retornar 401 ao tentar autenticar com senha invalida', async () => {
            const resposta = await request(process.env.BASE_URL)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send(senhaInvalida)

            expect(resposta.status).to.be.equal(401)
            expect(resposta.body).to.have.property('message', 'Senha inválida.')
        })

    })

})