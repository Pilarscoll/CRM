const db = require ('../config/db');
const { getById } = require('./usuarios_models');


const Producto = {


  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM producto WHERE activo= true');
    return rows;
  },


  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM producto WHERE id = ?', [id]);
    return rows[0]; 
  },

  
  create: async ({ nombre, descripcion, precio, stock, stock_minimo, activo }) => {
    const [result] = await db.query(
      `INSERT INTO producto
      (nombre, descripcion, precio, stock, stock_minimo, activo) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, precio, stock || 0, stock_minimo || 5, activo !== undefined ? activo : true]
    );
    return { id: result.insertId, nombre, descripcion, precio, stock, stock_minimo, activo };
  },


  update: async (id, { nombre, descripcion, precio, stock, stock_minimo, activo }) => {
    const [result] = await db.query(
      `UPDATE producto SET 
        nombre = ?, 
        descripcion = ?, 
        precio = ?, 
        stock = ?, 
        stock_minimo = ?, 
        activo = ? 
      WHERE id = ?`,
      [nombre, descripcion, precio, stock, stock_minimo, activo, id]
    );
    return result.affectedRows > 0;
  },

  // Eliminar producto
  delete: async (id) => {
const [result] = await db.query(
  'UPDATE producto SET activo = ? WHERE id = ?',
  [false, id]
);    return result.affectedRows > 0;
  }

};

module.exports = Producto;