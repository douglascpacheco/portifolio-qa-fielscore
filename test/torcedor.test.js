const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterToken } = require('../helpers/autenticacao')
const postTorcedor = require('../fixtures/postTorcedor.json')

describe('Torcedores', () => {

    let tokenTorcedor
    let tokenAdmin

    before(async () => {
        tokenTorcedor = await obterToken('fiel01@fiel.com', '1910')
        tokenAdmin = await obterToken('fiel07@fiel.com', '1910')
    })

    // --- POST ---
    describe('POST /torcedores', () => {
        it('Deve retornar 201 ao criar o cadastro do torcedor com sucesso', async () => {
            const bodyTorcedor = { ...postTorcedor }
            bodyTorcedor.nr_ft = '01'
            bodyTorcedor.nome = 'fiel01'
            bodyTorcedor.email = 'fiel01@fiel.com'

            const resposta = await request(process.env.BASE_URL)
                .post('/torcedores')
                .set('Content-Type', 'application/json')
                .send(bodyTorcedor)

            expect(resposta.status).to.be.equal(201)
            expect(resposta.body).to.have.property('role')
            expect(resposta.body.role).to.be.equal('torcedor')

        })

        it('Deve retornar 201 ao criar o cadastro do administrador com sucesso', async () => {
            const bodyTorcedor = { ...postTorcedor }

            const resposta = await request(process.env.BASE_URL)
                .post('/torcedores')
                .set('Content-Type', 'application/json')
                .send(bodyTorcedor)

            expect(resposta.status).to.be.equal(201)
            expect(resposta.body).to.have.property('role');
            expect(resposta.body.role).to.be.equal('admin')

        })

        it('Deve retornar 400 ao tentar criar um cadastro com perfil (role) inválido', async () => {
            const bodyTorcedor = { ...postTorcedor }
            bodyTorcedor.nr_ft = '0100'
            bodyTorcedor.nome = 'fiel0100'
            bodyTorcedor.email = 'fiel0100@fiel.com'
            bodyTorcedor.role = 'jogador'

            const resposta = await request(process.env.BASE_URL)
                .post('/torcedores')
                .set('Content-Type', 'application/json')
                .send(bodyTorcedor)

            expect(resposta.status).to.be.equal(400)

        })

        it('Deve retornar 409 ao tentar criar um cadastro já existente', async () => {
            const bodyTorcedor = { ...postTorcedor }

            const resposta = await request(process.env.BASE_URL)
                .post('/torcedores')
                .set('Content-Type', 'application/json')
                .send(bodyTorcedor)

            expect(resposta.status).to.be.equal(409)
            expect(resposta.body).to.have.property('message', 'Email ou nr_ft já cadastrado.');

        })
    })

    // --- GET ---
    describe('GET /torcedores', () => {

        it('Retornar 200 apenas com dados do torcedor autenticado (perfil torcedor)', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/torcedores')
                .set('Authorization', `Bearer ${tokenTorcedor}`)

            expect(resposta.status).to.be.equal(200)
            expect(resposta.body).to.be.an('array').that.has.lengthOf(1);

        })

        it('Deve retornar 200 ao buscar o próprio cadastro pelo ID (perfil torcedor)', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/torcedores/01')
                .set('Authorization', `Bearer ${tokenTorcedor}`)

            expect(resposta.status).to.be.equal(200)
            expect(resposta.body).to.have.property('id', '01');

        })

        it('Deve retornar 403 ao tentar acessar o cadastro de outro torcedor', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/torcedores/07')
                .set('Authorization', `Bearer ${tokenTorcedor}`)

            expect(resposta.status).to.be.equal(403)
            expect(resposta.body).to.have.property('message', 'Acesso negado.');

        })

        it('Deve retornar 200 ao listar todos os cadastros (perfil admin)', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/torcedores')
                .set('Authorization', `Bearer ${tokenAdmin}`)

            expect(resposta.status).to.be.equal(200)
            expect(resposta.body).to.be.an('array');

        })

        it('Deve retornar 200 ao buscar qualquer torcedor pelo ID (perfil admin)', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/torcedores/01')
                .set('Authorization', `Bearer ${tokenAdmin}`)

            expect(resposta.status).to.be.equal(200)
            expect(resposta.body).to.have.property('id', '01');

        })

    })

    // --- DELETE ---
    describe('DELETE /torcedores', () => {

        it('Deve retornar 204 ao excluir um torcedor com sucesso (perfil admin)', async () => {
            const resposta = await request(process.env.BASE_URL)
                .delete('/torcedores/022')
                .set('Authorization', `Bearer ${tokenAdmin}`)

            expect(resposta.status).to.equal(204);
            expect(resposta.body).to.be.empty;
        })

        it('Deve retornar 404 ao tentar excluir um torcedor inexistente (perfil admin)', async () => {
            const resposta = await request(process.env.BASE_URL)
                .delete('/torcedores/05554')
                .set('Authorization', `Bearer ${tokenAdmin}`)

            expect(resposta.status).to.equal(404);
            expect(resposta.body).to.have.property('message', 'Torcedor não encontrado.');
        })

        it('Deve retornar 403 ao tentar excluir um usuário sem permissão (perfil torcedor)', async () => {
            const resposta = await request(process.env.BASE_URL)
                .delete('/torcedores/05')
                .set('Authorization', `Bearer ${tokenTorcedor}`)

            expect(resposta.status).to.equal(403);
            expect(resposta.body).to.have.property('message', 'Apenas admin pode deletar torcedores.');
        })
    })
})