// tests/consultas.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Suíte de Testes: Rotas de Consultas', () => {
    let token;

    // Obtém um token válido atualizado antes de rodar os testes
    beforeAll(async () => {
        const loginRes = await request(app)
            .post('/auth/login')
            .send({
                email: 'gui@email.com',
                senha: '123456'
            });
        
        token = loginRes.body.token;
    });

    it('Deve retornar erro 401 ao tentar agendar sem token de acesso', async () => {
        const resposta = await request(app)
            .post('/consultas')
            .send({
                idTarologo: 1,
                dataHora: "2026-10-25T15:00:00.000Z",
                duracaoMinutos: 30
            });

        expect(resposta.status).toBe(401);
    });

    it('Deve criar um agendamento com sucesso quando os dados forem válidos', async () => {
        const resposta = await request(app)
            .post('/consultas')
            .set('Authorization', `Bearer ${token}`)
            .send({
                idTarologo: 1,
                dataHora: "2026-10-25T15:00:00.000Z",
                duracaoMinutos: 30
            });

        expect(resposta.status).toBe(201);
        expect(resposta.body).toHaveProperty('mensagem');
    });

    it('Deve retornar erro 400 (Zod) quando os dados enviados forem inválidos', async () => {
        const resposta = await request(app)
            .post('/consultas')
            .set('Authorization', `Bearer ${token}`) // Passa na autenticação para chegar na validação do Zod
            .send({
                idTarologo: "texto", // Inválido: deveria ser número
                dataHora: "data-invalida",
                duracaoMinutos: 5 // Inválido: menor que 15
            });

        expect(resposta.status).toBe(400);
        expect(resposta.body.mensagem).toContain('Dados inválidos');
    });

});