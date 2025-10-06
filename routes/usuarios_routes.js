const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarios_controllers');
const authMiddleware = require('../middleware/auth'); // opcional, para proteger rutas

// Rutas públicas
router.post('/login', usuarioController.login); // login sin token
router.post('/', usuarioController.create);    // crear usuario (podés protegerla si solo admin puede crear)

// Rutas protegidas (necesitan token JWT)
router.get('/', authMiddleware, usuarioController.getAll);
router.get('/:id', authMiddleware, usuarioController.getById);
router.put('/:id', authMiddleware, usuarioController.update);
router.delete('/:id', authMiddleware, usuarioController.delete);

module.exports = router;