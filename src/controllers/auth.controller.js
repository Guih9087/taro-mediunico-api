// src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Importamos os bancos em memória para validar logins
const { clientes } = require('./cliente.controller');
const { tarologos } = require('./tarologos.controller');
const { admins } = require('./admin.controller');

const SECRET_KEY = 'sua_chave_secreta_super_segura';

const login = (req, res, next) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            const erro = new Error('E-mail e senha são obrigatórios.');
            erro.status = 400;
            throw erro;
        }

        // Junta todas as listas para procurar o usuário
        const todosUsuarios = [
            ...clientes.map(c => ({ ...c, tipo: 'CLIENTE' })),
            ...tarologos.map(t => ({ ...t, tipo: 'TAROLOGO' })),
            ...admins.map(a => ({ ...a, tipo: 'ADMIN' }))
        ];

        const usuario = todosUsuarios.find(u => u.email === email);

        if (!usuario) {
            const erro = new Error('Credenciais inválidas.');
            erro.status = 401;
            throw erro;
        }

        const senhaValida = bcrypt.compareSync(senha, usuario.senha);

        if (!senhaValida) {
            const erro = new Error('Credenciais inválidas.');
            erro.status = 401;
            throw erro;
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, tipo: usuario.tipo },
            SECRET_KEY,
            { expiresIn: '8h' }
        );

        return res.json({
            mensagem: 'Login realizado com sucesso!',
            token,
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { login };