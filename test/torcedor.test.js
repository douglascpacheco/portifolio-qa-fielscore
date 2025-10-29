const request = require('supertest');
const { expect } = require('chai')

describe('Torcedor', () => {
    describe('POST /torcedores', () => {
        it('Deve retornar 201 ao criar o cadastro do torcedor com sucesso', async () => {
            const resposta = await request('http://localhost:3000')
                .post('/torcedores')
                .set('Content-Type', 'application/json')
                .send({
                    'nr_ft': '01121',
                    'nome': 'Pacheco121',
                    'email': 'pacheco121@fiel.com',
                    'senha': '1910'
                })

            expect(resposta.status).to.be.equal(201)
            expect(resposta.body).to.have.property('role');
            expect(resposta.body.role).to.be.equal('torcedor')

        })
    })

})