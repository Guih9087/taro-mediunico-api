// src/routes/cliente.routes.js
const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');
const { autenticar, apenasAdmin } = require('../middlewares/auth.middlewares');

// ROTAS DE SALDO/CARTEIRA
router.get('/saldo', autenticar, clienteController.verSaldo);
router.post('/saldo/recarga', autenticar, clienteController.adicionarSaldo);

// PÚBLICA: Qualquer visitante pode se cadastrar como cliente
router.post('/', clienteController.criarCliente);

// PROTEGIDA (ADMIN): Apenas o Admin pode ver a lista completa de clientes cadastrados
router.get('/', autenticar, apenasAdmin, clienteController.listarClientes);

// PROTEGIDA (AUTENTICADO): O cliente precisa estar logado para atualizar seus dados
router.put('/:id', autenticar, clienteController.atualizarCliente);

// PROTEGIDA (ADMIN): Apenas o Admin pode excluir uma conta de cliente diretamente
router.delete('/:id', autenticar, apenasAdmin, clienteController.deletarCliente);

module.exports = router;