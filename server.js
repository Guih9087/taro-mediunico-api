// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*" // Libera acesso para facilitar testes de conexão
    }
});

app.use(express.json());

// Importação das rotas
const authRoutes = require('./src/routes/auth.routes');
const clienteRoutes = require('./src/routes/cliente.routes');
const tarologosRoutes = require('./src/routes/tarologos.routes');
const adminRoutes = require('./src/routes/admin.routes');
const consultasRoutes = require('./src/routes/consultas.routes');
const avaliacoesRoutes = require('./src/routes/avaliacoes.routes');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./src/swagger.json');

// Importação do Middleware Global de Erros
const manipuladorDeErros = require('./src/middlewares/erro.middleware');

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

// CHAT EM TEMPO REAL 
io.on('connection', (socket) => {
    console.log(`⚡ Cliente conectado ao WebSocket: ${socket.id}`);

    // Entrar em uma sala privada referente a uma consulta específica
    socket.on('entrar_sala', (idConsulta) => {
        const nomeSala = `consulta_${idConsulta}`;
        socket.join(nomeSala);
        console.log(`🔑 Socket ${socket.id} entrou na sala: ${nomeSala}`);
    });

    // Receber mensagem do cliente/tarólogo e retransmitir na sala
    socket.on('enviar_mensagem', (data) => {
        const { idConsulta, emissor, mensagem } = data;
        
        const payloadMensagem = {
            emissor, // Ex: "Guilherme" ou "Astra Tarot"
            mensagem,
            horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };

        // Envia apenas para os participantes conectados na sala dessa consulta
        io.to(`consulta_${idConsulta}`).emit('receber_mensagem', payloadMensagem);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Usuário desconectado: ${socket.id}`);
    });
});


server.listen(3000, () => {
    console.log('🚀 Servidor e WebSockets rodando em http://localhost:3000');
});