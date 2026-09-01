const bcrypt = require('bcryptjs');

// Nosso "banco de dados" temporário
let clientes = [
    {
        id: 1,
        nome: 'Guilherme Catalani',
        email: 'gui@email.com',
        senha: bcrypt.hashSync('123456', 10),
        saldo: 100.00
        
    },
    {
        id: 2,
        nome: 'Grazielle Catalani',
        email: 'grazi@email.com',
        senha: bcrypt.hashSync('123456', 10),
        saldo: 50.00
    }
];

// Função para buscar clientes (GET)
const listarClientes = (req, res) => {
    res.json(clientes);
};

// Função para criar cliente (POST)
const criarCliente = (req, res) => {
    const { nome, email, saldo, senha } = req.body;
    const novoCliente = {
        id: clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1,
        nome,
        email,
        saldo: saldo || 0,
        senha: bcrypt.hashSync(senha, 10)
    };
    clientes.push(novoCliente);
    res.status(201).json({
        mensagem: 'Cliente criado com sucesso',
        cliente: novoCliente
    });
};
// Função para atualizar cliente (PUT)
const atualizarCliente = (req, res) => {
    const idBusca = Number(req.params.id);
    const { nome, email, saldo, senha } = req.body;

    const index = clientes.findIndex(c => c.id === idBusca);

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Cliente não encontrado' });
    }

    clientes[index] = {
        ...clientes[index],
        nome: nome !== undefined ? nome : clientes[index].nome,
        email: email !== undefined ? email : clientes[index].email,
        saldo: saldo !== undefined ? saldo : clientes[index].saldo,
        senha: senha !== undefined ? bcrypt.hashSync(senha, 10) : clientes[index].senha
    };

    return res.status(200).json({
        mensagem: 'Cliente atualizado com sucesso',
        cliente: clientes[index]
    });
};

// Função para deletar cliente (DELETE) 
const deletarCliente = (req, res) => {
    const idBusca = Number(req.params.id);
    const index = clientes.findIndex(c => c.id === idBusca);

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Cliente não encontrado para remoção' });
    }

    clientes.splice(index, 1);
    res.json({ mensagem: `Cliente com ID ${idBusca} removido com sucesso` });
};

// Precisamos EXPORTAR essas funções para que outros arquivos consigam usá-las
module.exports = {
    listarClientes,
    criarCliente,
    atualizarCliente,
    deletarCliente,
    clientes
};