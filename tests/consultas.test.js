// tests/consultas.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Suíte de Testes: Rotas de Consultas', () => {

    it('Deve criar um agendamento com sucesso quando os dados forem válidos', async () => {
        // 1. Gera token válido
        const loginRes = await request(app)
            .post('/auth/login')
            .send({ email: 'gui@email.com', senha: '123456' });

        const token = loginRes.body.token;

        // 2. Envia agendamento no formato ISO8601 e duração válida
        const resposta = await request(app)
            .post('/consultas')
            .set('Authorization', `Bearer ${token}`)
            .send({
                idTarologo: 1,
                dataHora: "2026-10-25T15:00:00.000Z",
                duracaoMinutos: 30
            });

        expect(resposta.status).toBe(201); // ou 200, conforme a resposta do controller
        expect(resposta.body).toHaveProperty('mensagem');
    });

    it('Deve retornar erro 400 (Zod) quando os dados enviados forem inválidos', async () => {
        // 1. Primeiro realiza o login para obter um token válido
        const loginRes = await request(app)
            .post('/auth/login')
            .send({
                email: 'gui@email.com',
                senha: '123456'
            });

        const token = loginRes.body.token;

        // 2. Tenta agendar com dados inválidos
        const resposta = await request(app)
            .post('/consultas')
            .set('Authorization', `Bearer ${token}`)
            .send({
                idTarologo: "um",
                dataHora: "hoje a noite",
                duracaoMinutos: 5
            });

        expect(resposta.status).toBe(400);
        expect(resposta.body.mensagem).toContain('Dados inválidos');
    });

});