// server.js
const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app'); // Importa a aplicação Express configurada

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

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
            emissor,
            mensagem,
            horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };

        io.to(`consulta_${idConsulta}`).emit('receber_mensagem', payloadMensagem);
    });

    socket.on('disconnect', () => {
        console.log(`❌ Usuário desconectado: ${socket.id}`);
    });
});

server.listen(3000, () => {
    console.log('🚀 Servidor e WebSockets rodando em http://localhost:3000');
});