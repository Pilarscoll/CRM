const Usuario = require('../models/usuarios_models');
const jwt = require('jsonwebtoken');

const usuarioController = {

  // Obtener todos los usuarios
  getAll: async (req, res) => {
    try {
      const usuarios = await Usuario.getAll();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un usuario por ID
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.getById(id);
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Crear un nuevo usuario
  create: async (req, res) => {
    try {
      const { nombre, email, password, telefono, rol_id } = req.body;
      const usuario = await Usuario.createDemo({ nombre, email, password, telefono, rol_id });
      res.status(201).json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
    createAdm: async (req, res) => {
    try {
      const { nombre, email, password, telefono, rol_id } = req.body;
      const usuario = await Usuario.create({ nombre, email, password, telefono, rol_id });
      res.status(201).json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  // Actualizar un usuario
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, email, password, telefono, rol_id } = req.body;
      const updated = await Usuario.update(id, { nombre, email, password, telefono, rol_id });
      if (!updated) return res.status(404).json({ error: 'Usuario no encontrado o no modificado' });
      res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar un usuario
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Usuario.delete(id);
      if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Autenticación (login)
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const usuario = await Usuario.authenticate(email, password);
      if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

      // Crear JWT
      const token = jwt.sign(
        { id: usuario.id, nombre: usuario.nombre, rol_id: usuario.rol_id },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.json({ usuario, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};

module.exports = usuarioController;
