// src/routes/consultas.routes.js
const express = require('express');
const router = express.Router();
const consultasController = require('../controllers/consultas.controller');
const { autenticar } = require('../middlewares/auth.middlewares');

// Todas as rotas de consulta exigem estar logado
router.use(autenticar);

// Agendar nova consulta
router.post('/', consultasController.agendarConsulta);

// Listar histórico de consultas do usuário logado
router.get('/minhas', consultasController.listarMinhasConsultas);

// Alterar o status da consulta (ex: iniciar/encerrar atendimento)
router.patch('/:id/status', consultasController.alterarStatusConsulta);

module.exports = router;