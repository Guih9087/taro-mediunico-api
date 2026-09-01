const bcrypt = require('bcryptjs');

// Banco de dados simulado (Lista de tarólogos)
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
        status: 'APROVADO', // Status ativo
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
        status: 'PENDENTE', // Aguardando aprovação do Admin
        tipo: 'TAROLOGO'
    }
];

// ROTA PÚBLICA: Lista apenas os tarólogos APROVADOS para os clientes
const listarTarologos = (req, res) => {
    const aprovados = tarologos.filter(t => t.status === 'APROVADO');
    res.json(aprovados);
};

// ROTA PÚBLICA: Busca um tarólogo específico pelo ID
const buscarTarologo = (req, res) => {
    const idBusca = Number(req.params.id);
    const tarologoEncontrado = tarologos.find(t => t.id === idBusca);

    if (!tarologoEncontrado) {
        return res.status(404).json({ mensagem: 'Tarólogo não encontrado' });
    }
    
    res.json(tarologoEncontrado);
};

// ROTA DE AUTO-CADASTRO: Novo tarólogo se cadastrando no site
const criarTarologo = (req, res) => {
    const { nome, email, especialidade, bio, valorConsulta, valorMinuto, senha } = req.body;

    const novoTarologo = {
        id: tarologos.length > 0 ? tarologos[tarologos.length - 1].id + 1 : 1,
        nome,
        email,
        especialidade,
        bio: bio || '',
        valorConsulta: valorConsulta || 0,
        valorMinuto: valorMinuto || 0,
        disponivel: true,
        status: 'PENDENTE', // <- Todo cadastro novo nasce PENDENTE aguardando o Admin
        tipo: 'TAROLOGO',
        senha: bcrypt.hashSync(senha, 10)
    };

    tarologos.push(novoTarologo);
    res.status(201).json({
        mensagem: 'Cadastro realizado com sucesso! Aguarde a aprovação do administrador.',
        tarologo: novoTarologo
    });
};

// ROTA DO PRÓPRIO TARÓLOGO: Atualizar seus dados de perfil
const atualizarTarologo = (req, res) => {
    const idBusca = Number(req.params.id);
    const { nome, especialidade, bio, valorConsulta, valorMinuto, disponivel, senha } = req.body;

    const index = tarologos.findIndex(t => t.id === idBusca);

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Tarólogo não encontrado' });
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
};

// ROTA DO PRÓPRIO TARÓLOGO: Deletar a própria conta
const removerTarologo = (req, res) => {
    const idBusca = Number(req.params.id);
    const index = tarologos.findIndex(t => t.id === idBusca);

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Tarólogo não encontrado para remoção' });
    }

    tarologos.splice(index, 1);
    res.json({ mensagem: `Tarólogo com ID ${idBusca} removido com sucesso` });
};

module.exports = {
    listarTarologos,
    buscarTarologo,
    criarTarologo,
    atualizarTarologo,
    removerTarologo,
    tarologos
};