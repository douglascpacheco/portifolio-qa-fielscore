const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterToken } = require('../helpers/autenticacao')
const { userAdmin } = require('../fixtures/postTorcedor.json')
const { usuarioValido } = require('../fixtures/postLogin.json')
const postJogos = require('../fixtures/postJogos.json')
const putJogos = require('../fixtures/putJogos.json')

describe('Execução testes Pipelines', () => {

    describe('POST /torcedores', () => {
        it('Deve retornar 201 ao criar o cadastro do administrador com sucesso', async () => {
            const resposta = await request(process.env.BASE_URL)
                .post('/torcedores')
                .set('Content-Type', 'application/json')
                .send(userAdmin)

            expect(resposta.status).to.be.equal(201)
            expect(resposta.body).to.have.property('role');
            expect(resposta.body.role).to.be.equal('admin')

        })

        describe('POST /auth/login', () => {
            it('Deve retornar 200 ao autenticar com credenciais válidas', async () => {
                const resposta = await request(process.env.BASE_URL)
                    .post('/auth/login')
                    .set('Content-Type', 'application/json')
                    .send(usuarioValido)

                expect(resposta.status).to.be.equal(200)
                expect(resposta.body.token).to.be.a('string');
            })

        })

        describe('GET /jogos', () => {

            it('Deve retornar 200 ao listar todos os jogos', async () => {
                const resposta = await request(process.env.BASE_URL)
                    .get('/jogos')

                expect(resposta.status).to.be.equal(200)
                expect(resposta.body).to.be.an('array')

            })

        })

    })

})