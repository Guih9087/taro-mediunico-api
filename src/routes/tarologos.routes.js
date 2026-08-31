const express = require('express');
// O Router é uma ferramenta do Express específica para criar mini-aplicativos de rotas
const router = express.Router(); 

// Importamos o nosso controlador que acabamos de criar
const tarologosController = require('../controllers/tarologos.controller');

// Toda vez que acessarem a rota principal ("/"), ele chama a função listarTarologos
router.get('/', tarologosController.listarTarologos);

// Quando mandarem um GET com um ID, chama a buscarTarologo
router.get('/:id', tarologosController.buscarTarologo);

// Quando mandarem um POST, chama a criarTarologo
router.post('/', tarologosController.criarTarologo);

// Quando mandarem um PUT com um ID, chama a atualizarTarologo
router.put('/:id', tarologosController.atualizarTarologo);

// Quando mandarem um DELETE com um ID, chama a removerTarologo
router.delete('/:id', tarologosController.removerTarologo);

module.exports = router;