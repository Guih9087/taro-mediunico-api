// src/routes/avaliacoes.routes.js
const express = require('express');
const router = express.Router();
const avaliacoesController = require('../controllers/avaliacoes.controller');
const { autenticar } = require('../middlewares/auth.middlewares');

// Criar avaliação (exige estar logado)
router.post('/', autenticar, avaliacoesController.criarAvaliacao);

// Ver avaliações de um tarólogo específico (pública)
router.get('/tarologo/:idTarologo', avaliacoesController.listarAvaliacoesTarologo);

module.exports = router;