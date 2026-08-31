const express = require('express');
// O Router é uma ferramenta do Express específica para criar mini-aplicativos de rotas
const router = express.Router(); 

// Importamos o nosso controlador que acabamos de criar
const clienteController = require('../controllers/cliente.controller');

// Toda vez que acessarem a rota principal ("/"), ele chama a função listarClientes
router.get('/', clienteController.listarClientes);

// Quando mandarem um POST, chama a criarCliente
router.post('/', clienteController.criarCliente);

// Quando mandarem um DELETE com um ID, chama a deletarCliente
router.delete('/:id', clienteController.deletarCliente);

// Quando mandarem um PUT com um ID, chama a atualizarCliente
router.put('/:id', clienteController.atualizarCliente);

// Exportamos o roteador pronto para o server.js usar
module.exports = router;