const Producto = require('../models/productos_models');

const productoController = {

  // Obtener todos los productos
  getAll: async (req, res) => {
    try {
      const productos = await Producto.getAll();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener producto por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await Producto.getById(id);
      if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json(producto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear un nuevo producto
  create: async (req, res) => {
    try {
      const { nombre, descripcion, precio, stock, stock_minimo, activo } = req.body;
      const producto = await Producto.create({ nombre, descripcion, precio, stock, stock_minimo, activo });
      res.status(201).json(producto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un producto
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio, stock, stock_minimo, activo } = req.body;
      const updated = await Producto.update(id, { nombre, descripcion, precio, stock, stock_minimo, activo });
      if (!updated) return res.status(404).json({ error: 'Producto no encontrado o no modificado' });
      res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar un producto
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Producto.delete(id);
      if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};

module.exports = productoController;
