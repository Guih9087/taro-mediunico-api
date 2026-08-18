const express = require('express');
const app = express();
const PORT = 3000;

//Permite que o Ecpress entenda requisições com JSON
app.use(express.json());

//rota de teste
app.get('/', (req, res) => {
    res.send('API do tarô Mediúnico rodando com sucesso!');
});

//Inicialização do servidor
aap.listen(PORT, () => {
    console.log('Servidor rodando em http://localhost:${PORT}');
});
