const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productos_controllers');
const authMiddleware = require('../middleware/auth'); // middleware JWT opcional

// Rutas públicas o protegidas según quieras
// Si querés que cualquiera pueda ver los productos, podés dejar getAll y getById sin auth
router.get('/', productoController.getAll);              // Listar todos los productos
router.get('/:id', productoController.getById);          // Obtener producto por ID

// Rutas protegidas (crear, actualizar, eliminar)
router.post('/', authMiddleware, productoController.create);
router.put('/:id', authMiddleware, productoController.update);
router.delete('/:id', authMiddleware, productoController.delete);

module.exports = router;
