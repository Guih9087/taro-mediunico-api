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

//ROTA DE TESTE INICIAL
app.get('/', (req, res) => {
    res.send('API do tarô Mediúnico rodando com sucesso!');
});

//ROTA PARA LISTAR TODOS OS TARÓLOGOS
app.get('/tarologos', (req, res) => {
    res.json(tarologos);
});

//ROTA PARA BUSCAR UM TARÓLOGO PELO ID
app.get('/tarologos/:id', (req, res) => {
    const idBusca = Number(req.params.id);
    const tarologoEncontrado = tarologos.find(t => t.id === idBusca);
    if (!tarologoEncontrado) {
        return res.status(404).json({ mensagem: 'Tarologo não encontrado' });
    }
    
    res.json(tarologoEncontrado);
})

//ROTA POST PARA CADASTRAR UM NOVO TARÓLOGO
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

//INICIALIZAÇÃO DO SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

//ROTA PUT PARA ATUALIZAR OS DADOS DE UM TARÓLOGO PELO ID
app.put('/tarologos/:id', (req, res) => {
    const idBusca = Number(req.params.id);
    const { nome, especialidade, valorConsulta, disponivel } = req.body;

    //Busca a posição (indice) do tarologo na lista
    const index = tarologos.findIndex(t => t.id === idBusca);

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Tarologo não encontrado para atualização' });
    }

    //Atualiza os campos do tarologo encontrado na lista
    tarologos[index] = {
        id: idBusca,
        nome: nome || tarologos[index].nome,
        especialidade: especialidade || tarologos[index].especialidade,
        valorConsulta: valorConsulta || tarologos[index].valorConsulta,
        disponivel: disponivel !== undefined ? disponivel : tarologos[index].disponivel
    };

    res.json(tarologos[index]);
});

//ROTA DELETE PARA REMOVER UM TARÓLOGO PELO ID
app.delete('/tarologos/:id', (req, res) => {
    const idBusca = Number(req.params.id);
    const index = tarologos.findIndex(t => t.id === idBusca);

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Tarologo não encontrado para remoção' });
    }

    // Remove um item a partir da posição (index) na lista
    tarologos.splice(index, 1);
    res.json({ mensagem: `Tarologo com ID ${idBusca} removido com sucesso` });
});