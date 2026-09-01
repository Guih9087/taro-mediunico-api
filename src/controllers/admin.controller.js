// src/controllers/admin.controller.js

const bcrypt = require('bcryptjs');
const { tarologos } = require('./tarologos.controller');

// Nosso "banco de dados" temporário de Administradores
let admins = [
    {
        id: 1,
        nome: 'Administrador Master',
        email: 'admin@taromediunico.com',
        senha: bcrypt.hashSync('admin123', 10), // Senha padrão para testes
        tipo: 'ADMIN'
    }
];

// Rota de exemplo para o painel de controle do Admin
const painelAdmin = (req, res) => {
    res.json({
        mensagem: 'Bem-vindo ao Painel Administrativo!',
        estatisticas: {
            statusSistema: 'Operacional',
            usuarioLogado: req.usuario // Dados vindos do Token JWT
        }
    });
};
// 1. Listar TODOS os tarólogos (Aprovados, Pendentes e Bloqueados)
const listarTodosTarologos = (req, res) => {
    res.json(tarologos);
};

// 2. Aprovar ou Bloquear um tarólogo (PATCH /admin/tarologos/:id/status)
const alterarStatusTarologo = (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Espera 'APROVADO' ou 'BLOQUEADO'

    const tarologo = tarologos.find(t => t.id === Number(id));

    if (!tarologo) {
        return res.status(404).json({ mensagem: 'Tarólogo não encontrado' });
    }

    if (!['APROVADO', 'BLOQUEADO', 'PENDENTE'].includes(status)) {
        return res.status(400).json({ mensagem: 'Status inválido. Use APROVADO, BLOQUEADO ou PENDENTE' });
    }

    tarologo.status = status;

    return res.json({
        mensagem: `Status do tarólogo ${tarologo.nome} alterado para ${status} com sucesso!`,
        tarologo: tarologo
    });
};

// 3. Deletar um tarólogo da base (DELETE /admin/tarologos/:id)
const deletarTarologo = (req, res) => {
    const { id } = req.params;
    const index = tarologos.findIndex(t => t.id === Number(id));

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Tarólogo não encontrado' });
    }

    const tarologoRemovido = tarologos.splice(index, 1);

    return res.json({
        mensagem: `Tarólogo ${tarologoRemovido[0].nome} removido do sistema com sucesso.`
    });
};

module.exports = {
    admins,
    painelAdmin,
    listarTodosTarologos,
    alterarStatusTarologo,
    deletarTarologo
};