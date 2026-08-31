// Nosso "banco de dados" temporário
// Banco de dados simulado (Lista de tarólogos)
let tarologos = [
    { 
        id: 1, 
        nome: 'Soraia Vidente', 
        especialidade: 'Tarot de Marselha', 
        bio: 'Especialista em orientações amorosas e profissionais há mais de 10 anos.',
        valorConsulta: 120, 
        valorMinuto: 4.50,
        disponivel: true 
    },
    { 
        id: 2, 
        nome: 'Mestre Mael', 
        especialidade: 'Baralho Cigano', 
        bio: 'Leitura intuitiva focada em autoconhecimento e caminhos espirituais.',
        valorConsulta: 90, 
        valorMinuto: 3.50,
        disponivel: true 
    },
    { 
        id: 3, 
        nome: 'Luna Astral', 
        especialidade: 'Tarot de Thoth', 
        bio: 'Mestra em tarô de Thoth, astrologia tradicional e abertura de caminhos.',
        valorConsulta: 150, 
        valorMinuto: 5.00,
        disponivel: false 
    },
];

// ROTA PARA LISTAR TODOS OS TARÓLOGOS
const listarTarologos = (req, res) => {
    res.json(tarologos);
};

// ROTA PARA BUSCAR UM TARÓLOGO PELO ID
const buscarTarologo = (req, res) => {
    const idBusca = Number(req.params.id);
    const tarologoEncontrado = tarologos.find(t => t.id === idBusca);

    if (!tarologoEncontrado) {
        return res.status(404).json({ mensagem: 'Tarólogo não encontrado' });
    }
    
    res.json(tarologoEncontrado);
};

// ROTA POST PARA CADASTRAR UM NOVO TARÓLOGO
const criarTarologo = (req, res) => {
    const { nome, especialidade, bio, valorConsulta, valorMinuto } = req.body;

    const novoTarologo = {
        id: tarologos.length > 0 ? tarologos[tarologos.length - 1].id + 1 : 1,
        nome: nome,
        especialidade: especialidade,
        bio: bio || '',
        valorConsulta: valorConsulta || 0,
        valorMinuto: valorMinuto || 0,
        disponivel: true
    };

    tarologos.push(novoTarologo);
    res.status(201).json(novoTarologo);
};

// ROTA PUT PARA ATUALIZAR OS DADOS DE UM TARÓLOGO EXISTENTE
const atualizarTarologo = (req, res) => {
    const idBusca = Number(req.params.id);
    const { nome, especialidade, bio, valorConsulta, valorMinuto, disponivel } = req.body;

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
        disponivel: disponivel !== undefined ? disponivel : tarologos[index].disponivel
    };

    return res.status(200).json({
        mensagem: 'Tarólogo atualizado com sucesso',
        tarologo: tarologos[index]
    });
};

// ROTA DELETE PARA REMOVER UM TARÓLOGO PELO ID
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
    removerTarologo
};