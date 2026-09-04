// src/controllers/cliente.controller.js
const bcrypt = require('bcryptjs');

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

const listarClientes = (req, res, next) => {
    try {
        return res.json(clientes);
    } catch (error) {
        next(error);
    }
};

const criarCliente = (req, res, next) => {
    try {
        const { nome, email, saldo, senha } = req.body;

        if (!nome || !email || !senha) {
            const erro = new Error('Nome, e-mail e senha são obrigatórios.');
            erro.status = 400;
            throw erro;
        }

        const novoCliente = {
            id: clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1,
            nome,
            email,
            saldo: saldo || 0,
            senha: bcrypt.hashSync(senha, 10)
        };

        clientes.push(novoCliente);

        return res.status(201).json({
            mensagem: 'Cliente criado com sucesso',
            cliente: novoCliente
        });
    } catch (error) {
        next(error);
    }
};

const atualizarCliente = (req, res, next) => {
    try {
        const idBusca = Number(req.params.id);
        const { nome, email, saldo, senha } = req.body;

        const index = clientes.findIndex(c => c.id === idBusca);

        if (index === -1) {
            const erro = new Error('Cliente não encontrado');
            erro.status = 404;
            throw erro;
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
    } catch (error) {
        next(error);
    }
};

const deletarCliente = (req, res, next) => {
    try {
        const idBusca = Number(req.params.id);
        const index = clientes.findIndex(c => c.id === idBusca);

        if (index === -1) {
            const erro = new Error('Cliente não encontrado para remoção');
            erro.status = 404;
            throw erro;
        }

        clientes.splice(index, 1);
        return res.json({ mensagem: `Cliente com ID ${idBusca} removido com sucesso` });
    } catch (error) {
        next(error);
    }
};

const verSaldo = (req, res, next) => {
    try {
        const idCliente = req.usuario.id;
        const cliente = clientes.find(c => c.id === idCliente);

        if (!cliente) {
            const erro = new Error('Cliente não encontrado');
            erro.status = 404;
            throw erro;
        }

        return res.json({
            cliente: cliente.nome,
            saldo: cliente.saldo
        });
    } catch (error) {
        next(error);
    }
};

const adicionarSaldo = (req, res, next) => {
    try {
        const idCliente = req.usuario.id;
        const { valor } = req.body;

        if (!valor || Number(valor) <= 0) {
            const erro = new Error('Informe um valor de recarga válido');
            erro.status = 400;
            throw erro;
        }

        const cliente = clientes.find(c => c.id === idCliente);

        if (!cliente) {
            const erro = new Error('Cliente não encontrado');
            erro.status = 404;
            throw erro;
        }

        cliente.saldo += Number(valor);

        return res.json({
            mensagem: `Recarga de R$ ${Number(valor).toFixed(2)} realizada com sucesso!`,
            novoSaldo: cliente.saldo
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listarClientes,
    criarCliente,
    atualizarCliente,
    deletarCliente,
    verSaldo,        // <-- Nova exportação
    adicionarSaldo,  // <-- Nova exportação
    clientes
};