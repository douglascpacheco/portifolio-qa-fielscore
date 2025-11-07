const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterToken } = require('../helpers/autenticacao')
const postFrequencia = require('../fixtures/postFrequencia.json')
const queryFrequencia = require('../fixtures/queryFrequencia.json')

describe('Frequencia', () => {
    let tokenTorcedor
    let tokenAdmin

    before(async () => {
        tokenTorcedor = await obterToken('fiel01@fiel.com', '1910')
        tokenAdmin = await obterToken('fiel07@fiel.com', '1910')
    })


    // --- POST ---
    describe('POST /frequencia', () => {
        it('Deve retornar 201 ao registrar frequência do próprio torcedor', async () => {
            const bodyFrequencia = { ...postFrequencia }

            const resposta = await request(process.env.BASE_URL)
                .post('/frequencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenTorcedor}`)
                .send(bodyFrequencia)

            expect(resposta.status).to.be.equal(201)
            expect(resposta.body).to.have.property('id_jogo', '13');
            expect(resposta.body).to.have.property('nr_ft', '01');

        })

        it('Deve retornar 403 ao tentar registrar frequência de outro torcedor sem ser admin', async () => {
            const bodyFrequencia = { ...postFrequencia }
            bodyFrequencia.id_jogo = '15'
            bodyFrequencia.nr_ft = '07'

            const resposta = await request(process.env.BASE_URL)
                .post('/frequencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenTorcedor}`)
                .send(bodyFrequencia)

            expect(resposta.status).to.be.equal(403)
            expect(resposta.body).to.have.property('message', 'Acesso negado.');

        })

        it('Deve retornar 201 ao registrar frequência para qualquer torcedor com perfil admin', async () => {
            const bodyFrequencia = { ...postFrequencia }
            bodyFrequencia.id_jogo = '16'

            const resposta = await request(process.env.BASE_URL)
                .post('/frequencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(bodyFrequencia)

            expect(resposta.status).to.be.equal(201)
            expect(resposta.body).to.have.property('id_jogo', '16');
            expect(resposta.body).to.have.property('nr_ft', '01');

        })

        it('Deve retornar 409 ao tentar registrar presença duplicada para mesmo torcedor e jogo', async () => {
            const bodyFrequencia = { ...postFrequencia }
            bodyFrequencia.id_jogo = '16'

            const resposta = await request(process.env.BASE_URL)
                .post('/frequencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(bodyFrequencia)

            expect(resposta.status).to.be.equal(409)
            expect(resposta.body).to.have.property('message', 'Frequência já registrada.');

        })

        it('Deve retornar 201 e pontuação correta ao registrar ingresso tipo "FT"', async () => {
            const bodyFrequencia = { ...postFrequencia }
            bodyFrequencia.id_jogo = '17'
            bodyFrequencia.tipo_ingresso = 'FT'

            const resposta = await request(process.env.BASE_URL)
                .post('/frequencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(bodyFrequencia)

            expect(resposta.status).to.be.equal(201)
            expect(resposta.body).to.have.property('nr_ft', '01');
            expect(resposta.body).to.have.property('pontuacao', 20);

        })

        it('Deve retornar 201 e pontuação correta ao registrar ingresso tipo "meia"', async () => {
            const bodyFrequencia = { ...postFrequencia }
            bodyFrequencia.id_jogo = '23'
            bodyFrequencia.tipo_ingresso = 'meia'

            const resposta = await request(process.env.BASE_URL)
                .post('/frequencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(bodyFrequencia)

            expect(resposta.status).to.be.equal(201)
            expect(resposta.body).to.have.property('nr_ft', '01');
            expect(resposta.body).to.have.property('pontuacao', 10);

        })

        it('Deve retornar 201 e pontuação correta ao registrar ingresso tipo "inteira"', async () => {
            const bodyFrequencia = { ...postFrequencia }
            bodyFrequencia.id_jogo = '22'
            bodyFrequencia.tipo_ingresso = 'inteira'

            const resposta = await request(process.env.BASE_URL)
                .post('/frequencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(bodyFrequencia)

            expect(resposta.status).to.be.equal(201)
            expect(resposta.body).to.have.property('nr_ft', '01');
            expect(resposta.body).to.have.property('pontuacao', 15);

        })

        it('Deve retornar 404 ao registrar frequência para nr-ft inexistente', async () => {
            const bodyFrequencia = { ...postFrequencia }
            bodyFrequencia.id_jogo = '23'
            bodyFrequencia.nr_ft = '16432'

            const resposta = await request(process.env.BASE_URL)
                .post('/frequencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(bodyFrequencia)

            expect(resposta.status).to.equal(404);
            expect(resposta.body).to.have.property('message', 'Torcedor não encontrado.');

        })

        it('Deve retornar 404 ao registrar frequência para jogo inexistente', async () => {
            const bodyFrequencia = { ...postFrequencia }
            bodyFrequencia.id_jogo = '233232'

            const resposta = await request(process.env.BASE_URL)
                .post('/frequencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(bodyFrequencia)

            expect(resposta.status).to.equal(404);
            expect(resposta.body).to.have.property('message', 'Jogo não encontrado.');

        })


        it('Deve retornar 400 ao tentar registrar frequência com campos obrigatórios ausentes', async () => {
            const bodyFrequencia = { ...postFrequencia }
            delete bodyFrequencia.nr_ft; // remove campo original

            const resposta = await request(process.env.BASE_URL)
                .post('/frequencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .send(bodyFrequencia)

            expect(resposta.status).to.be.equal(400)
            expect(resposta.body).to.have.property('message', 'Campos obrigatórios.');

        })

    })

    // --- GET ---
    describe('GET /frequencia', () => {

        it('Deve retornar 200 e listar todas as frequências (perfil admin)', async () => {

            const resposta = await request(process.env.BASE_URL)
                .get('/frequencias')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .query(queryFrequencia.comAdminId) // usa o fixture

            expect(resposta.status).to.be.equal(200);
            expect(resposta.body).to.have.property('frequencias').that.is.an('array');

        })

        it('Deve retornar 200 e listar apenas as próprias frequências (perfil torcedor)', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/frequencias')
                .set('Authorization', `Bearer ${tokenTorcedor}`)
                .query(queryFrequencia.comTorcedorId) // usa o fixture

            expect(resposta.status).to.be.equal(200);
            expect(resposta.body).to.have.property('frequencias').that.is.an('array');

        })

        it('Deve retornar 200 e exibir as estatísticas de fidelidade quando includeStats=true', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/frequencias')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .query(queryFrequencia.comAdminId) // usa o fixture

            expect(resposta.status).to.be.equal(200);
            expect(resposta.body).to.have.property('frequencias').that.is.an('array');
            expect(resposta.body).to.have.property('total_jogos');
            expect(resposta.body).to.have.property('pontuacao_total');
            expect(resposta.body).to.have.property('categoria_fidelidade');

        })

        it('Deve retornar 200 e listar apenas as frequências quando includeStats=false', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/frequencias')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .query(queryFrequencia.AdminSemStats) // usa o fixture

            expect(resposta.status).to.be.equal(200);
            expect(resposta.body).to.have.property('frequencias').that.is.an('array');

            // Validando que os campos de estatística NÃO existem
            expect(resposta.body).to.not.have.property('total_jogos');
            expect(resposta.body).to.not.have.property('pontuacao_total');
            expect(resposta.body).to.not.have.property('categoria_fidelidade');

        })

        it('Deve retornar 400 ao enviar parâmetro includeStats inválido', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/frequencias')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .query(queryFrequencia.CampoInvalido) // usa o fixture

            expect(resposta.status).to.be.equal(400)

        })

        it('Deve retornar 403 ao tentar visualizar frequências de outro torcedor (perfil torcedor)', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/frequencias')
                .set('Authorization', `Bearer ${tokenTorcedor}`)
                .query(queryFrequencia.comAdminId) // usa o fixture

            expect(resposta.status).to.be.equal(403)
            expect(resposta.body).to.have.property('message', 'Acesso negado.');

        })

        it('Deve retornar 404 ao consultar frequências de torcedor inexistente', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/frequencias')
                .set('Authorization', `Bearer ${tokenTorcedor}`)
                .query(queryFrequencia.torcedorIdInvalido) // usa o fixture

            expect(resposta.status).to.equal(404);
            expect(resposta.body).to.have.property('message', 'Torcedor não encontrado.');

        })

        it('Deve retornar 400 ao não informar o parâmetro torcedorId', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/frequencias')
                .set('Authorization', `Bearer ${tokenAdmin}`)
                .query(queryFrequencia.semTorcedorId) // usa o fixture

            expect(resposta.status).to.equal(400);
            expect(resposta.body).to.have.property('message', 'torcedorId obrigatório.');

        })

    })

})