// src/routes/consultas.routes.js
const express = require('express');
const router = express.Router();
const consultasController = require('../controllers/consultas.controller');
const { autenticar } = require('../middlewares/auth.middlewares');

// Importa o middleware e o schema
const validar = require('../middlewares/validar.middleware');
const { agendarConsultaSchema } = require('../schemas/consultas.schema');

// A validação roda APÓS a autenticação e ANTES do controller
router.post(
    '/', 
    autenticar, 
    validar(agendarConsultaSchema), 
    consultasController.agendarConsulta
);

router.get('/minhas', autenticar, consultasController.listarMinhasConsultas);
router.patch('/:id/status', autenticar, consultasController.alterarStatusConsulta);

module.exports = router;