// tests/auth.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Suíte de Testes: Autenticação (/auth)', () => {

    it('Deve realizar login com sucesso e retornar o token JWT', async () => {
        const resposta = await request(app)
            .post('/auth/login')
            .send({
                email: 'gui@email.com',
                senha: '123456'
            });

        expect(resposta.status).toBe(200);
        expect(resposta.body).toHaveProperty('token');
        expect(resposta.body.usuario).toHaveProperty('email', 'gui@email.com');
    });

    it('Deve retornar erro 401 ao tentar login com senha incorreta', async () => {
        const resposta = await request(app)
            .post('/auth/login')
            .send({
                email: 'gui@email.com',
                senha: 'senha_errada'
            });

        expect(resposta.status).toBe(401);
        expect(resposta.body.mensagem).toBe('Credenciais inválidas.');
    });

});