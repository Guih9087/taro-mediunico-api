// src/app.js
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Importação das rotas
const authRoutes = require('./routes/auth.routes');
const clienteRoutes = require('./routes/cliente.routes');
const tarologosRoutes = require('./routes/tarologos.routes');
const adminRoutes = require('./routes/admin.routes');
const consultasRoutes = require('./routes/consultas.routes');
const avaliacoesRoutes = require('./routes/avaliacoes.routes');

// Importação do Middleware Global de Erros
const manipuladorDeErros = require('./middlewares/erro.middleware');

const app = express();

app.use(express.json());

// Registro das rotas
app.use('/auth', authRoutes);
app.use('/clientes', clienteRoutes);
app.use('/tarologos', tarologosRoutes);
app.use('/admin', adminRoutes);
app.use('/consultas', consultasRoutes);
app.use('/avaliacoes', avaliacoesRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware de erro (sempre por último)
app.use(manipuladorDeErros);

module.exports = app;