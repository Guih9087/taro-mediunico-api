const express = require('express');
const app = express();
const PORT = 3000;

// Permite que o Express entenda requisições com JSON
app.use(express.json());

//=============================================
//            CRUD DE TARÓLOGOS
//=============================================

// Banco de dados simulado (Lista de tarólogos)
const tarologos = [
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

// ROTA DE TESTE INICIAL
app.get('/', (req, res) => {
    res.send('API do Tarô Mediúnico rodando com sucesso!');
});

// ROTA PARA LISTAR TODOS OS TARÓLOGOS
app.get('/tarologos', (req, res) => {
    res.json(tarologos);
});

// ROTA PARA BUSCAR UM TARÓLOGO PELO ID
app.get('/tarologos/:id', (req, res) => {
    const idBusca = Number(req.params.id);
    const tarologoEncontrado = tarologos.find(t => t.id === idBusca);

    if (!tarologoEncontrado) {
        return res.status(404).json({ mensagem: 'Tarólogo não encontrado' });
    }
    
    res.json(tarologoEncontrado);
});

// ROTA POST PARA CADASTRAR UM NOVO TARÓLOGO
app.post('/tarologos', (req, res) => {
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
});

// ROTA PUT PARA ATUALIZAR OS DADOS DE UM TARÓLOGO EXISTENTE
app.put('/tarologos/:id', (req, res) => {
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
});

// ROTA DELETE PARA REMOVER UM TARÓLOGO PELO ID
app.delete('/tarologos/:id', (req, res) => {
    const idBusca = Number(req.params.id);
    const index = tarologos.findIndex(t => t.id === idBusca);

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Tarólogo não encontrado para remoção' });
    }

    tarologos.splice(index, 1);
    res.json({ mensagem: `Tarólogo com ID ${idBusca} removido com sucesso` });
});

//=============================================
//            CRUD DE CLIENTES
//=============================================

const clientes = [
    {
        id: 1,
        nome: 'Guilherme Catalani',
        email: 'gui@email.com',
        saldo: 100.00
    },
    {
        id: 2,
        nome: 'Grazielle Catalani',
        email: 'grazi@email.com',
        saldo: 50.00
    }
];

app.get('/clientes', (req, res) => {
    res.json(clientes);
});

app.put('/clientes/:id', (req, res) => {
    const idBusca = Number(req.params.id);
    const { nome, email, saldo } = req.body;

    const index = clientes.findIndex(c => c.id === idBusca);

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    clientes[index] = {
        ...clientes[index],
        nome: nome !== undefined ? nome : clientes[index].nome,
        email: email !== undefined ? email : clientes[index].email,
        saldo: saldo !== undefined ? saldo : clientes[index].saldo
    };

    return res.status(200).json({
        mensagem: 'Cliente atualizado com sucesso',
        cliente: clientes[index]
    });
});


//=====================================================================================================================================
// INICIALIZAÇÃO DO SERVIDOR (Sempre no final)
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});