const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();
const { obterToken } = require('../helpers/autenticacao')
const postTransferencias = require('../fixtures/postTransferencias.json')

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
            const bodyTransferencias = { ...postTransferencias }
            bodyTransferencias.nr_ft = '077'
            bodyTransferencias.nome = 'fiel077'
            bodyTransferencias.email = 'fiel077@fiel.com'

            const resposta = await request(process.env.BASE_URL)
                .post('/torcedores')
                .set('Content-Type', 'application/json')
                .send(bodyTransferencias)

            expect(resposta.status).to.be.equal(201)
            expect(resposta.body).to.have.property('role')
            expect(resposta.body.role).to.be.equal('torcedor')

        })

        it('Deve retornar 201 ao criar o cadastro do administrador com sucesso', async () => {
            const bodyTransferencias = { ...postTransferencias }

            const resposta = await request(process.env.BASE_URL)
                .post('/torcedores')
                .set('Content-Type', 'application/json')
                .send(bodyTransferencias)

            expect(resposta.status).to.be.equal(201)
            expect(resposta.body).to.have.property('role');
            expect(resposta.body.role).to.be.equal('admin')

        })

        it('Deve retornar 400 ao criar o cadastro com role diferente de Torcedor ou Admin', async () => {
            const bodyTransferencias = { ...postTransferencias }
            bodyTransferencias.nr_ft = '0100'
            bodyTransferencias.nome = 'fiel0100'
            bodyTransferencias.email = 'fiel0100@fiel.com'

            const resposta = await request(process.env.BASE_URL)
                .post('/torcedores')
                .set('Content-Type', 'application/json')
                .send(bodyTransferencias)

            expect(resposta.status).to.be.equal(400)

        })

        it('Deve retornar 409 ao tentar criar um cadastro duplicado', async () => {
            const resposta = await request(process.env.BASE_URL)
            const bodyTransferencias = { ...postTransferencias }
                .post('/torcedores')
                .set('Content-Type', 'application/json')
                .send(bodyTransferencias)

            expect(resposta.status).to.be.equal(409)
            expect(resposta.body).to.have.property('message', 'Email ou nr_ft já cadastrado.');

        })
    })

    // --- GET ---
    describe('GET /torcedores', () => {

        it('Perfil Torcedor, deve listar apenas o seu cadastro', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/torcedores')
                .set('Authorization', `Bearer ${tokenTorcedor}`)

            expect(resposta.status).to.be.equal(200)
            expect(res.body).to.be.an('array').that.has.lengthOf(1);

        })

        it('Torcedor deve buscar com sucesso seu cadastro passando seu id de identificação', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/torcedores/01')
                .set('Authorization', `Bearer ${tokenTorcedor}`)

            expect(resposta.status).to.be.equal(200)
            expect(resposta.body).to.have.property('id', '01');

        })

        it('Torcedor não pode buscar o cadastro de outro torcedor', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/torcedores/02')
                .set('Authorization', `Bearer ${tokenTorcedor}`)

            expect(resposta.status).to.be.equal(403)
            expect(resposta.body).to.have.property('message', 'Acesso negado.');

        })

        it('Perfil Admin, deve listar todos os usuarios cadastrados com sucesso', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/torcedores')
                .set('Authorization', `Bearer ${tokenAdmin}`)

            expect(resposta.status).to.be.equal(200)
            expect(resposta.body).to.be.an('array');

        })

        it('Admin pode buscar qualquer torcedor passando seu id de identificação', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/torcedores/01')
                .set('Authorization', `Bearer ${tokenAdmin}`)

            expect(resposta.status).to.be.equal(200)
            expect(resposta.body).to.have.property('id', '01');

        })

    })

    // --- DELETE ---
    describe('DELETE /torcedores', () => {

        it('Perfil de Admin deve excluir um torcedor com sucesso', async () => {
            const resposta = await request(process.env.BASE_URL)
                .delete('/torcedores/022')
                .set('Authorization', `Bearer ${tokenAdmin}`)

            expect(resposta.status).to.equal(204);
            expect(resposta.body).to.be.empty;
        })

        it('Deve retornar 404 ao tentar excluir um usuario inexistente', async () => {
            const resposta = await request(process.env.BASE_URL)
                .delete('/torcedores/05554')
                .set('Authorization', `Bearer ${tokenAdmin}`)

            expect(resposta.status).to.equal(404);
            expect(resposta.body).to.have.property('message', 'Torcedor não encontrado.');
        })

        it('Deve retornar 403 ao perfil de Torcedor ao tentar excluir um usuario', async () => {
            const resposta = await request(process.env.BASE_URL)
                .delete('/torcedores/05')
                .set('Authorization', `Bearer ${tokenTorcedor}`)

            expect(resposta.status).to.equal(403);
            expect(resposta.body).to.have.property('message', 'Apenas admin pode deletar torcedores.');
        })
    })
})