const request = require('supertest');
const { expect } = require('chai')

describe('Login', () => {
    describe('POST /auth/login', () => {
        it('Deve retornar 200 com um token em string quando usar credenciais validas', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send({
                    'email': 'pacheco121@fiel.com',
                    'password': '1910'
                })

            expect(resposta.status).to.be.equal(200)
            expect(resposta.body.token).to.be.a('string');
        })

    })

})