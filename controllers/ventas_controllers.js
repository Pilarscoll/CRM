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
    const { usuario_id, producto, total, estado } = req.body;

    // Validar campos
    if (!usuario_id) return res.status(400).json({ error: 'Falta usuario_id' });
    if (!total) return res.status(400).json({ error: 'Falta el total de la venta' });
    if (!estado) return res.status(400).json({ error: 'Falta el estado de la venta' });

    // Crear la venta
    const fecha = new Date(); // fecha actual
    const venta = await Venta.create({ usuario_id, fecha, total, estado });

    // Insertar productos asociados (si tenés tabla intermedia)
    // Ejemplo: productos_venta (venta_id, producto_id, cantidad)
   

    res.status(201).json({ mensaje: 'Venta creada con éxito', venta });
  } catch (error) {
    console.error(error);
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