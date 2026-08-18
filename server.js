const express = require('express');
const app = express();
const PORT = 3000;

//Permite que o Express entenda requisições com JSON
app.use(express.json());

//Banco de daods sumulado (Lista de tarologos)
const tarologos = [
    { id: 1, nome: 'Soraia Vidente', especialidade: 'Tarot de Marselha', valorConsulta: 120, disponivel: true },
    { id: 2, nome: 'Mestre Mael', especialidade: 'Baralho Cigano', valorConsulta: 90, disponivel: true },
    { id: 3, nome: 'Luna Astral', especialidade: 'Tarot de Thoth', valorConsulta: 150, disponivel: false },
]

//rota de teste inicial
app.get('/', (req, res) => {
    res.send('API do tarô Mediúnico rodando com sucesso!');
});

//Rota para listar TODOS os tarólogos
app.get('/tarologos', (req, res) => {
    res.json(tarologos);
});

//rota para buscar UM tarólogo específico pelo ID
app.get('/tarologos/:id', (req, res) => {
    const idBusca = Number(req.params.id);
    const tarologoEncontrado = tarologos.find(t => t.id === idBusca);
    if (!tarologoEncontrado) {
        return res.status(404).json({ mensagem: 'Tarologo não encontrado' });
    }
    
    res.json(tarologoEncontrado);
})

//Rota POST para cadastrar um novo tarólogo
app.post('/tarologos', (req, res) => {
    //PEGA OS DADOS ENVIADOS NO CORPO DA REQUEISIÇÃO (JSON)
    const { nome, especialidade, valorConsulta } = req.body;

    //CRIA O NOVO OBJETO COM UM ID AUTOMATICO
    const novoTarologo = {
        id: tarologos.length + 1,
        nome: nome,
        especialidade: especialidade,
        valorConsulta: valorConsulta,
        disponivel: true
    };

    //ADICIONA O NOVO TARÓLOGO NO FINAL DA ARRAY
    tarologos.push(novoTarologo);

    //RETORNA O STATUS 201 (CRIADO COM SUCESSO) E O OBJETO CADASTRADO
    res.status(201).json(novoTarologo);

});

//Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
