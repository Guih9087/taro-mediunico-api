const express = require('express');
const app = express();
const PORT = 3000; 

// Para o Express entender arquivos JSON
app.use(express.json());

// IMPORTANDO AS ROTAS
const clienteRoutes = require('./src/routes/cliente.routes');

const tarologosRoutes = require('./src/routes/tarologos.routes');

const authRoutes = require('./src/routes/auth.routes');

const adminRoutes = require('./src/routes/admin.routes');

// USANDO AS ROTAS
app.use('/auth', authRoutes);

app.use('/admin', adminRoutes);

app.use('/clientes', clienteRoutes);

app.use('/tarologos', tarologosRoutes);

//=====================================================================================================================================
// INICIALIZAÇÃO DO SERVIDOR (Sempre no final)
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
