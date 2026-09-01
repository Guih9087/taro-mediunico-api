// src/routes/admin.routes.js

const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const { autenticar, apenasAdmin } = require('../middlewares/auth.middlewares');

// Todas as rotas abaixo requerem Token válido + Privilégio de ADMIN
router.use(autenticar, apenasAdmin);
router.get('/dashboard', autenticar, apenasAdmin, adminController.painelAdmin);

// Gestão de Tarólogos pelo Admin
router.get('/tarologos', adminController.listarTodosTarologos);
router.patch('/tarologos/:id/status', adminController.alterarStatusTarologo);
router.delete('/tarologos/:id', adminController.deletarTarologo);

module.exports = router;