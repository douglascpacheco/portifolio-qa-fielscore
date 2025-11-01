const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterToken } = require('../helpers/autenticacao')
const postJogos = require('../fixtures/postJogos.json')

describe('Jogos', () => {

    let tokenTorcedor
    let tokenAdmin

    before(async () => {
        tokenTorcedor = await obterToken('fiel01@fiel.com', '1910')
        tokenAdmin = await obterToken('fiel07@fiel.com', '1910')
    })

    // --- POST ---
    describe('POST /jogos', () => {
        it('Deve retornar 201 ao cadastrar um jogo com sucesso', async () => {
            const bodyJogos = { ...postJogos }

            const resposta = await request(process.env.BASE_URL)
                .post('/jogos')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(bodyJogos)

            expect(resposta.status).to.be.equal(201)
            expect(resposta.body).to.not.be.empty;

        })

        it('Deve retornar 409 ao tentar criar um jogo já cadastrado', async () => {
            const bodyJogos = { ...postJogos }

            const resposta = await request(process.env.BASE_URL)
                .post('/jogos')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(bodyJogos)

            expect(resposta.status).to.be.equal(409)
            expect(resposta.body).to.have.property('message', 'Jogo já cadastrado.');

        })

        it('Deve retornar 403 ao tentar cadastrar um jogo sem permissão (perfil torcedor)', async () => {
            const bodyJogos = { ...postJogos }

            const resposta = await request(process.env.BASE_URL)
                .post('/jogos')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenTorcedor}`)
                .send(bodyJogos)

            expect(resposta.status).to.be.equal(403)
            expect(resposta.body).to.have.property('message', 'Apenas admin pode criar jogos.');
        })

        it('Deve retornar 400 ao tentar cadastrar um jogo com campos invalidos/incompletos', async () => {
            const bodyJogos = { ...postJogos }
            delete bodyJogos.competicao; // remove campo original

            const resposta = await request(process.env.BASE_URL)
                .post('/jogos')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(bodyJogos)

            expect(resposta.status).to.be.equal(400)
            expect(resposta.body).to.have.property('message', 'Campos obrigatórios.');
        })


        // --- GET ---
        describe('GET /jogos', () => {

            it('Deve retornar 200 ao listar todos os jogos', async () => {
                const resposta = await request(process.env.BASE_URL)
                    .get('/jogos')

                expect(resposta.status).to.be.equal(200)
                expect(resposta.body).to.be.an('array')

            })

            it('Deve retornar 200 ao buscar um jogo pelo ID existente', async () => {
                const queryParams = { id: '01' };

                const resposta = await request(process.env.BASE_URL)
                    .get('/jogos')
                    .query(queryParams) // monta a query string automaticamente

                expect(resposta.status).to.be.equal(200)
                expect(resposta.body).to.be.an('array').that.has.lengthOf(1);

            })

            it('Deve retornar 404 ao tentar buscar um jogo inexistente pelo campo competicao', async () => {
                const queryParams = { competicao: 'ucl' };

                const resposta = await request(process.env.BASE_URL)
                    .get('/jogos')
                    .query(queryParams) // monta a query string automaticamente

                expect(resposta.status).to.be.equal(404)

            })

            // --- PUT ---
            describe('PUT /jogos', () => {
                it('Deve retornar 200 ao atualizar um jogo com sucesso (perfil admin)', async () => {
                    const bodyJogos = {
                        local: "sorocaba",
                        competicao: "libertadores"
                    }

                    const resposta = await request(process.env.BASE_URL)
                        .put('/jogos/02')
                        .set('Content-Type', 'application/json')
                        .set('Authorization', `Bearer ${tokenAdmin}`)
                        .send(bodyJogos)

                    expect(resposta.status).to.be.equal(200)
                    expect(resposta.body).to.have.property('local', 'sorocaba');
                    expect(resposta.body).to.have.property('competicao', 'libertadores');
                    expect(resposta.body).to.have.property('id', '02');

                })

                it('Deve retornar 403 ao tentar atualizar um jogo sem permissão (perfil torcedor)', async () => {
                    const bodyJogos = {
                        local: "sorocaba",
                        competicao: "libertadores"
                    }

                    const resposta = await request(process.env.BASE_URL)
                        .put('/jogos/02')
                        .set('Content-Type', 'application/json')
                        .set('Authorization', `Bearer ${tokenTorcedor}`)
                        .send(bodyJogos)

                    expect(resposta.status).to.be.equal(403)
                    expect(resposta.body).to.have.property('message', 'Apenas admin pode atualizar jogos.');

                })

                it('Deve retornar 404 ao realizar busca por um jogo inexistente', async () => {
                    const bodyJogos = {
                        local: "sorocaba",
                        competicao: "libertadores"
                    }

                    const resposta = await request(process.env.BASE_URL)
                        .put('/jogos/0243')
                        .set('Content-Type', 'application/json')
                        .set('Authorization', `Bearer ${tokenAdmin}`)
                        .send(bodyJogos)

                    expect(resposta.status).to.be.equal(404)
                    expect(resposta.body).to.have.property('message', 'Jogo não encontrado.');

                })

                it('Deve retornar 400 ao tentar atualizar um jogo com dados inválidos', async () => {
                    const bodyJogos = { CPF: "1234567" }

                    const resposta = await request(process.env.BASE_URL)
                        .put('/jogos/02')
                        .set('Content-Type', 'application/json')
                        .set('Authorization', `Bearer ${tokenAdmin}`)
                        .send(bodyJogos)

                    expect(resposta.status).to.be.equal(400)

                })

            })

            // --- DELETE ---
            describe('DELETE /jogos', () => {

                it('Deve retornar 204 ao excluir um jogo com sucesso (perfil admin)', async () => {
                    const resposta = await request(process.env.BASE_URL)
                        .delete('/jogos/06')
                        .set('Authorization', `Bearer ${tokenAdmin}`)

                    expect(resposta.status).to.equal(204);
                    expect(resposta.body).to.be.empty;
                })

                it('Deve retornar 404 ao tentar excluir um jogo inexistente', async () => {
                    const resposta = await request(process.env.BASE_URL)
                        .delete('/jogos/05554')
                        .set('Authorization', `Bearer ${tokenAdmin}`)

                    expect(resposta.status).to.equal(404);
                    expect(resposta.body).to.have.property('message', 'Jogo não encontrado.');
                })

                it('Deve retornar 403 ao tentar excluir um jogo sem permissão (perfil torcedor)', async () => {
                    const resposta = await request(process.env.BASE_URL)
                        .delete('/jogos/05')
                        .set('Authorization', `Bearer ${tokenTorcedor}`)

                    expect(resposta.status).to.equal(403);
                    expect(resposta.body).to.have.property('message', 'Apenas admin pode deletar jogos.');
                })
            })

        })

    })
})