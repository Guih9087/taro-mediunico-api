// src/middlewares/auth.middleware.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'minha_chave_secreta_taro_mediunico';

// 1. Verifica se a requisição possui um Token JWT válido
const autenticar = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ mensagem: 'Token de acesso não fornecido' });
    }

    // O padrão de envio é: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ mensagem: 'Formato de token inválido (esperado: Bearer <token>)' });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded; // Anexa os dados decodificados (id, email, tipo) no objeto da requisição
        return next(); // Libera para prosseguir até a rota final
    } catch (err) {
        return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
    }
};

// 2. Verifica se o usuário logado possui perfil de ADMIN
const apenasAdmin = (req, res, next) => {
    if (req.usuario && req.usuario.tipo === 'ADMIN') {
        return next(); // É admin! Pode prosseguir.
    }
    
    return res.status(403).json({ mensagem: 'Acesso negado: Requer privilégios de Administrador' });
};

module.exports = {
    autenticar,
    apenasAdmin
};