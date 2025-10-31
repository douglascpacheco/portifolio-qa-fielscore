const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config()
const { obterToken } = require('../helpers/autenticacao')
const { postLogin } = require('../fixtures/postLogin.json')

describe('Login', () => {
    describe('POST /auth/login', () => {
        it('Deve retornar 200 com um token em string quando usar credenciais validas', async () => {
            const bodyLogin = { ...postLogin }

            const resposta = await request(process.env.BASE_URL)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin)

            expect(resposta.status).to.be.equal(200)
            expect(resposta.body.token).to.be.a('string');
        })

        it('Deve retornar 401 ao tentar se logar com credenciais invalidas', async () => {
            const bodyLogin = { ...postLogin }
            bodyLogin.email = 'fiel307@fiel.com'
            bodyLogin.password = '19310'
            
            const resposta = await request(process.env.BASE_URL)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin)

            expect(resposta.status).to.be.equal(401)
            expect(resposta.body).to.have.property('message')
        })

    })

})