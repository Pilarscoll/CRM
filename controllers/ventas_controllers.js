const Venta = require('../models/ventas_models');

const ventaController = {

  // Obtener todas las ventas
  getAll: async (req, res) => {
    try {
      const ventas = await Venta.getAll();
      res.json(ventas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener venta por ID (con detalle)
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const venta = await Venta.getById(id);
      if (!venta) return res.status(404).json({ error: 'Venta no encontrada' });
      res.json(venta);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

create: async (req, res) => {
  try {
    const { usuario_id, producto_id, cantidad } = req.body;

    // Validaciones
    if (!usuario_id) return res.status(400).json({ error: 'Falta usuario_id' });
    if (!producto_id) return res.status(400).json({ error: 'Falta producto_id' });
    if (!cantidad || cantidad <= 0) return res.status(400).json({ error: 'Cantidad inválida' });

    // Crear la venta usando el método del modelo
    const venta = await Venta.create({ usuario_id, producto_id, cantidad });

    res.status(201).json({
      mensaje: 'Venta creada con éxito',
      venta,
    });

  } catch (error) {
    console.error('Error al crear venta:', error);
    res.status(400).json({ error: error.message });
  }
},


  // Actualizar estado de venta
  updateEstado: async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      const updated = await Venta.updateEstado(id, estado);
      if (!updated) return res.status(404).json({ error: 'Venta no encontrada o no modificada' });
      res.json({ message: 'Estado de venta actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar venta
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Venta.delete(id);
      if (!deleted) return res.status(404).json({ error: 'Venta no encontrada' });
      res.json({ message: 'Venta eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};

module.exports = ventaController;