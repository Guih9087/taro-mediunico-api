// src/controllers/avaliacoes.controller.js
const { consultas } = require('./consultas.controller');

let avaliacoes = [];

// Cadastrar avaliação (Apenas cliente da consulta)
const criarAvaliacao = (req, res, next) => {
    try {
        const { idConsulta, nota, comentario } = req.body;
        const idCliente = req.usuario.id;

        if (!idConsulta || !nota) {
            const erro = new Error('O ID da consulta e a nota são obrigatórios.');
            erro.status = 400;
            throw erro;
        }

        if (Number(nota) < 1 || Number(nota) > 5) {
            const erro = new Error('A nota deve ser um valor entre 1 e 5.');
            erro.status = 400;
            throw erro;
        }

        const consulta = consultas.find(c => c.id === Number(idConsulta));

        if (!consulta) {
            const erro = new Error('Consulta não encontrada.');
            erro.status = 404;
            throw erro;
        }

        if (consulta.idCliente !== idCliente) {
            const erro = new Error('Você só pode avaliar consultas que você mesmo realizou.');
            erro.status = 403;
            throw erro;
        }

        if (consulta.status !== 'FINALIZADO') {
            const erro = new Error('Apenas consultas finalizadas podem receber avaliação.');
            erro.status = 400;
            throw erro;
        }

        const jaAvaliada = avaliacoes.some(a => a.idConsulta === Number(idConsulta));
        if (jaAvaliada) {
            const erro = new Error('Esta consulta já foi avaliada anteriormente.');
            erro.status = 400;
            throw erro;
        }

        const novaAvaliacao = {
            id: avaliacoes.length > 0 ? avaliacoes[avaliacoes.length - 1].id + 1 : 1,
            idConsulta: Number(idConsulta),
            idCliente,
            idTarologo: consulta.idTarologo,
            nota: Number(nota),
            comentario: comentario || '',
            criadoEm: new Date()
        };

        avaliacoes.push(novaAvaliacao);

        return res.status(201).json({
            mensagem: 'Avaliação enviada com sucesso!',
            avaliacao: novaAvaliacao
        });
    } catch (error) {
        next(error);
    }
};

// Listar avaliações e média de um tarólogo (Pública)
const listarAvaliacoesTarologo = (req, res, next) => {
    try {
        const { idTarologo } = req.params;
        const lista = avaliacoes.filter(a => a.idTarologo === Number(idTarologo));

        const somaNotas = lista.reduce((acc, a) => acc + a.nota, 0);
        const media = lista.length > 0 ? (somaNotas / lista.length).toFixed(1) : 0;

        return res.json({
            idTarologo: Number(idTarologo),
            mediaNotas: Number(media),
            totalAvaliacoes: lista.length,
            avaliacoes: lista
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    criarAvaliacao,
    listarAvaliacoesTarologo,
    avaliacoes
};