// src/controllers/admin.controller.js
const bcrypt = require('bcryptjs');
const { tarologos } = require('./tarologos.controller');

// Banco de dados temporário de Administradores
let admins = [
    {
        id: 1,
        nome: 'Administrador Master',
        email: 'admin@taromediunico.com',
        senha: bcrypt.hashSync('admin123', 10),
        tipo: 'ADMIN'
    }
];

const painelAdmin = (req, res, next) => {
    try {
        return res.json({
            mensagem: 'Bem-vindo ao Painel Administrativo!',
            estatisticas: {
                statusSistema: 'Operacional',
                usuarioLogado: req.usuario
            }
        });
    } catch (error) {
        next(error);
    }
};

const listarTodosTarologos = (req, res, next) => {
    try {
        return res.json(tarologos);
    } catch (error) {
        next(error);
    }
};

const alterarStatusTarologo = (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const tarologo = tarologos.find(t => t.id === Number(id));

        if (!tarologo) {
            const erro = new Error('Tarólogo não encontrado');
            erro.status = 404;
            throw erro;
        }

        if (!['APROVADO', 'BLOQUEADO', 'PENDENTE'].includes(status)) {
            const erro = new Error('Status inválido. Use APROVADO, BLOQUEADO ou PENDENTE');
            erro.status = 400;
            throw erro;
        }

        tarologo.status = status;

        return res.json({
            mensagem: `Status do tarólogo ${tarologo.nome} alterado para ${status} com sucesso!`,
            tarologo: tarologo
        });
    } catch (error) {
        next(error);
    }
};

const deletarTarologo = (req, res, next) => {
    try {
        const { id } = req.params;
        const index = tarologos.findIndex(t => t.id === Number(id));

        if (index === -1) {
            const erro = new Error('Tarólogo não encontrado');
            erro.status = 404;
            throw erro;
        }

        const tarologoRemovido = tarologos.splice(index, 1);

        return res.json({
            mensagem: `Tarólogo ${tarologoRemovido[0].nome} removido do sistema com sucesso.`
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    admins,
    painelAdmin,
    listarTodosTarologos,
    alterarStatusTarologo,
    deletarTarologo
};