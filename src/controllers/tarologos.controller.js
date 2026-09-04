// src/controllers/tarologos.controller.js
const bcrypt = require('bcryptjs');

let tarologos = [
    {
        id: 1,
        nome: 'Astra Tarot',
        email: 'astra@taro.com',
        senha: bcrypt.hashSync('123456', 10),
        especialidade: 'Cartomancia e Astrologia',
        bio: 'Com mais de 5 anos de experiência, Astra Tarot oferece leituras precisas e intuitivas para ajudar você a encontrar clareza e orientação.',
        valorConsulta: 100,
        valorMinuto: 3.00,
        disponivel: true,
        status: 'APROVADO',
        tipo: 'TAROLOGO'
    },
    {
        id: 2,
        nome: 'Mestre Sol',
        email: 'sol@taro.com',
        senha: bcrypt.hashSync('123456', 10),
        especialidade: 'Tarô de Marselha',
        bio: 'Especialista em tarô de Marselha, com mais de 10 anos de experiência em leituras intuitivas.',
        valorConsulta: 120,
        valorMinuto: 4.00,
        disponivel: true,
        status: 'PENDENTE',
        tipo: 'TAROLOGO'
    }
];

const listarTarologos = (req, res, next) => {
    try {
        const aprovados = tarologos.filter(t => t.status === 'APROVADO');
        return res.json(aprovados);
    } catch (error) {
        next(error);
    }
};

const buscarTarologo = (req, res, next) => {
    try {
        const idBusca = Number(req.params.id);
        const tarologoEncontrado = tarologos.find(t => t.id === idBusca);

        if (!tarologoEncontrado) {
            const erro = new Error('Tarólogo não encontrado');
            erro.status = 404;
            throw erro;
        }

        return res.json(tarologoEncontrado);
    } catch (error) {
        next(error);
    }
};

const criarTarologo = (req, res, next) => {
    try {
        const { nome, email, especialidade, bio, valorConsulta, valorMinuto, senha } = req.body;

        if (!nome || !email || !senha) {
            const erro = new Error('Nome, e-mail e senha são obrigatórios.');
            erro.status = 400;
            throw erro;
        }

        const novoTarologo = {
            id: tarologos.length > 0 ? tarologos[tarologos.length - 1].id + 1 : 1,
            nome,
            email,
            especialidade: especialidade || '',
            bio: bio || '',
            valorConsulta: valorConsulta || 0,
            valorMinuto: valorMinuto || 0,
            disponivel: true,
            status: 'PENDENTE',
            tipo: 'TAROLOGO',
            senha: bcrypt.hashSync(senha, 10)
        };

        tarologos.push(novoTarologo);

        return res.status(201).json({
            mensagem: 'Cadastro realizado com sucesso! Aguarde a aprovação do administrador.',
            tarologo: novoTarologo
        });
    } catch (error) {
        next(error);
    }
};

const atualizarTarologo = (req, res, next) => {
    try {
        const idBusca = Number(req.params.id);
        const { nome, especialidade, bio, valorConsulta, valorMinuto, disponivel, senha } = req.body;

        const index = tarologos.findIndex(t => t.id === idBusca);

        if (index === -1) {
            const erro = new Error('Tarólogo não encontrado');
            erro.status = 404;
            throw erro;
        }

        tarologos[index] = {
            ...tarologos[index],
            nome: nome !== undefined ? nome : tarologos[index].nome,
            especialidade: especialidade !== undefined ? especialidade : tarologos[index].especialidade,
            bio: bio !== undefined ? bio : tarologos[index].bio,
            valorConsulta: valorConsulta !== undefined ? valorConsulta : tarologos[index].valorConsulta,
            valorMinuto: valorMinuto !== undefined ? valorMinuto : tarologos[index].valorMinuto,
            disponivel: disponivel !== undefined ? disponivel : tarologos[index].disponivel,
            senha: senha !== undefined ? bcrypt.hashSync(senha, 10) : tarologos[index].senha
        };

        return res.status(200).json({
            mensagem: 'Tarólogo atualizado com sucesso',
            tarologo: tarologos[index]
        });
    } catch (error) {
        next(error);
    }
};

const removerTarologo = (req, res, next) => {
    try {
        const idBusca = Number(req.params.id);
        const index = tarologos.findIndex(t => t.id === idBusca);

        if (index === -1) {
            const erro = new Error('Tarólogo não encontrado para remoção');
            erro.status = 404;
            throw erro;
        }

        tarologos.splice(index, 1);
        return res.json({ mensagem: `Tarólogo com ID ${idBusca} removido com sucesso` });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listarTarologos,
    buscarTarologo,
    criarTarologo,
    atualizarTarologo,
    removerTarologo,
    tarologos
};