const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config()
const { postLogin } = require('../fixtures/postLogin.json')

describe('Login', () => {
    describe('POST /auth/login', () => {
        it('Deve retornar 200 ao autenticar com credenciais válidas', async () => {
            const bodyLogin = { ...postLogin }

            const resposta = await request(process.env.BASE_URL)
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send(bodyLogin)

            expect(resposta.status).to.be.equal(200)
            expect(resposta.body.token).to.be.a('string');
        })

        it('Deve retornar 401 ao tentar autenticar com credenciais inválidas', async () => {
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