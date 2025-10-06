const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventas_controllers');
const authMiddleware = require('../middleware/auth');

// Rutas públicas (solo lectura)
router.get('/', authMiddleware, ventaController.getAll);      // Listar todas las ventas
router.get('/:id', authMiddleware, ventaController.getById);  // Obtener venta por ID con detalle

// Rutas protegidas (crear, actualizar estado, eliminar)
router.post('/', authMiddleware, ventaController.create);           // Crear nueva venta
router.put('/:id/estado', authMiddleware, ventaController.updateEstado); // Actualizar estado de venta
router.delete('/:id', authMiddleware, ventaController.delete);      // Eliminar venta

module.exports = router;
