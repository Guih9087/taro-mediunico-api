// src/routes/tarologos.routes.js
const express = require('express');
const router = express.Router();
const tarologosController = require('../controllers/tarologos.controller');

// Importamos os middlewares de segurança
const { autenticar, apenasAdmin } = require('../middlewares/auth.middlewares');

// PÚBLICAS: Qualquer cliente/visitante pode ver a lista de aprovados e ver detalhes
router.get('/', tarologosController.listarTarologos);
router.get('/:id', tarologosController.buscarTarologo);

// PÚBLICA: Novo tarólogo se cadastrando (vai pra lista PENDENTE)
router.post('/', tarologosController.criarTarologo);

// PROTEGIDA (AUTENTICADO): O tarólogo precisa estar logado para alterar seus dados
router.put('/:id', autenticar, tarologosController.atualizarTarologo);

// PROTEGIDA (ADMIN): Apenas o Admin remove tarólogos por essa rota geral
router.delete('/:id', autenticar, apenasAdmin, tarologosController.removerTarologo);

module.exports = router;