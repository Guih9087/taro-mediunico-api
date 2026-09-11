// tests/tarologos.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Suíte de Testes: Tarólogos (/tarologos)', () => {

    it('Deve listar todos os tarólogos cadastrados', async () => {
        const resposta = await request(app)
            .get('/tarologos');

        expect(resposta.status).toBe(200);
        expect(Array.isArray(resposta.body)).toBe(true);
    });

});