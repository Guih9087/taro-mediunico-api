// src/app.js
require('dotenv').config(); // Carrega as variáveis do arquivo .env

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Importação das rotas
const authRoutes = require('./routes/auth.routes');
const clienteRoutes = require('./routes/cliente.routes');
const tarologosRoutes = require('./routes/tarologos.routes');
const adminRoutes = require('./routes/admin.routes');
const consultasRoutes = require('./routes/consultas.routes');
const avaliacoesRoutes = require('./routes/avaliacoes.routes');
const manipuladorDeErros = require('./middlewares/erro.middleware');

const app = express();

// Proteção de Cabeçalhos HTTP
app.use(helmet());

// Limite de Requisições (Rate Limiting) - Máximo de 100 requisições a cada 15 minutos por IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { mensagem: 'Muitas requisições vindas deste IP, tente novamente mais tarde.' }
});

// Aplica o limitador apenas se não estiver rodando testes
if (process.env.NODE_ENV !== 'test') {
    app.use(limiter);
}

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Registro das rotas
app.use('/auth', authRoutes);
app.use('/clientes', clienteRoutes);
app.use('/tarologos', tarologosRoutes);
app.use('/admin', adminRoutes);
app.use('/consultas', consultasRoutes);
app.use('/avaliacoes', avaliacoesRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware de erro
app.use(manipuladorDeErros);

module.exports = app;