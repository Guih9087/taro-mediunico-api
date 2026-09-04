// src/controllers/auth.controller.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Importamos os dados de clientes e tarólogos
const { clientes } = require('./cliente.controller');
const { tarologos } = require('./tarologos.controller');
const { admins } = require('./admin.controller');

// Chave secreta para assinar o Token (no futuro vai para o arquivo .env)
const JWT_SECRET = 'minha_chave_secreta_taro_mediunico';

const login = (req, res) => {
    const { email, senha } = req.body;

    // Busca na ordem: Admin -> Cliente -> Tarólogo
    let usuario = admins.find(a => a.email === email);
    let tipoUsuario = 'ADMIN';

    if (!usuario) {
        usuario = clientes.find(c => c.email === email);
        tipoUsuario = 'CLIENTE';
    }

    if (!usuario) {
        usuario = tarologos.find(t => t.email === email);
        tipoUsuario = 'TAROLOGO';
    }

    // Se não achou em nenhuma das tres listas
    if (!usuario) {
        return res.status(401).json({ mensagem: 'E-mail ou senha inválidos' });
    }

    // Comparar a senha digitada com a senha criptografada salva no banco
    const senhaValida = bcrypt.compareSync(senha, usuario.senha);

    if (!senhaValida) {
        return res.status(401).json({ mensagem: 'E-mail ou senha inválidos' });
    }

    // Se deu tudo certo, gerar o Token JWT 
    const token = jwt.sign(
        { id: usuario.id, email: usuario.email, tipo: tipoUsuario },
        JWT_SECRET,
        { expiresIn: '8h' } // Token expira em 8 horas
    );

    // Retornar a resposta de sucesso com o Token
    return res.json({
        mensagem: 'Login realizado com sucesso!',
        token: token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: tipoUsuario
        }
    });
};

module.exports = { login };