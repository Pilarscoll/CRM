const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Usuario = {

  // Obtener todos los usuarios
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM usuarios_crm');
    return rows;
  },

  // Obtener un usuario por ID
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM usuarios_crm WHERE id = ?', [id]);
    return rows[0]; // retorna el primer resultado
  },

  // Crear un nuevo usuario
  createDemo: async ({ nombre, email, password, telefono, rol_id }) => {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      'INSERT INTO usuarios_crm (nombre, email, password_hash, telefono, rol_id) VALUES (?, ?, ?, ?, 4)',
      [nombre, email, password_hash, telefono, rol_id]
    );
    return { id: result.insertId, nombre, email, telefono, rol_id };
  },

    // Crear un nuevo usuario
  create: async ({ nombre, email, password, telefono, rol_id }) => {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await db.query(
      'INSERT INTO usuarios_crm (nombre, email, password_hash, telefono, rol_id) VALUES (?, ?, ?, ?, 4)',
      [nombre, email, password_hash, telefono, rol_id]
    );
    return { id: result.insertId, nombre, email, telefono, rol_id };
  },

  // Actualizar un usuario
  update: async (id, { nombre, email, password, telefono, rol_id }) => {
    let password_hash;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(password, salt);
    }

    const [result] = await db.query(
      `UPDATE usuarios_crm SET 
        nombre = ?, 
        email = ?, 
        ${password ? 'password_hash = ?,' : ''} 
        telefono = ?, 
        rol_id = ? 
      WHERE id = ?`,
      password ? [nombre, email, password_hash, telefono, rol_id, id] : [nombre, email, telefono, rol_id, id]
    );

    return result.affectedRows > 0;
  },

  // Eliminar un usuario
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM usuarios_crm WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Autenticación (login)
  authenticate: async (email, password) => {
    const [rows] = await db.query('SELECT * FROM usuarios_crm WHERE email = ?', [email]);
    if (rows.length === 0) return null;

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    return isMatch ? user : null;
  }

};

module.exports = Usuario;
