const express = require('express');
const app = express();
const PORT = 3000; 

// Para o Express entender arquivos JSON
app.use(express.json());

// 1. IMPORTANDO AS ROTAS
const clienteRoutes = require('./src/routes/cliente.routes');

const tarologosRoutes = require('./src/routes/tarologos.routes');
// 2. AVISANDO O EXPRESS PARA USAR AS ROTAS

app.use('/clientes', clienteRoutes);

app.use('/tarologos', tarologosRoutes);

//=====================================================================================================================================
// INICIALIZAÇÃO DO SERVIDOR (Sempre no final)
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
