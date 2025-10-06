const db = require('../config/db');

const Venta = {

  // Obtener todas las ventas
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT v.id, v.usuario_id, v.total, v.fecha, v.estado, u.nombre as usuario_nombre
      FROM venta v
      LEFT JOIN usuarios_crm u ON v.usuario_id = u.id
      ORDER BY v.fecha DESC
    `);
    return rows;
  },

  // Obtener venta por ID (con detalle de productos)
  getById: async (id) => {
    const [ventas] = await db.query('SELECT * FROM venta WHERE id = ?', [id]);
    if (ventas.length === 0) return null;

    const venta = ventas[0];
    const [detalle] = await db.query(`
      SELECT dv.id, dv.producto_id, p.nombre as producto_nombre, dv.cantidad, dv.precio_unitario
      FROM detalle_venta dv
      JOIN producto p ON dv.producto_id = p.id
      WHERE dv.venta_id = ?
    `, [id]);

    venta.detalle = detalle;
    return venta;
  },

  // Crear una venta con detalle
  create: async ({ usuario_id, productos }) => {
    // productos = [{ producto_id, cantidad }]
    let total = 0;

    // Comenzar transacción
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Calcular total
      for (const item of productos) {
        const [rows] = await connection.query('SELECT precio, stock FROM producto WHERE id = ?', [item.producto_id]);
        if (rows.length === 0) throw new Error(`Producto ID ${item.producto_id} no encontrado`);
        if (rows[0].stock < item.cantidad) throw new Error(`Stock insuficiente para ${rows[0].nombre}`);
        total += rows[0].precio * item.cantidad;
      }

      // Insertar venta
      const [ventaResult] = await connection.query(
        'INSERT INTO venta (usuario_id, total, estado) VALUES (?, ?, ?)',
        [usuario_id, total, 'confirmada']
      );
      const venta_id = ventaResult.insertId;

      // Insertar detalle y actualizar stock
      for (const item of productos) {
        const [rows] = await connection.query('SELECT precio, stock FROM producto WHERE id = ?', [item.producto_id]);
        await connection.query(
          'INSERT INTO detalle_venta (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
          [venta_id, item.producto_id, item.cantidad, rows[0].precio]
        );
        await connection.query(
          'UPDATE producto SET stock = stock - ? WHERE id = ?',
          [item.cantidad, item.producto_id]
        );
      }

      await connection.commit();
      return await Venta.getById(venta_id);

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Actualizar estado de venta
  updateEstado: async (id, estado) => {
    const [result] = await db.query('UPDATE venta SET estado = ? WHERE id = ?', [estado, id]);
    return result.affectedRows > 0;
  },

  // Eliminar venta
  delete: async (id) => {
    // Opcional: restaurar stock antes de borrar
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [detalle] = await connection.query('SELECT producto_id, cantidad FROM detalle_venta WHERE venta_id = ?', [id]);
      for (const item of detalle) {
        await connection.query('UPDATE producto SET stock = stock + ? WHERE id = ?', [item.cantidad, item.producto_id]);
      }

      await connection.query('DELETE FROM detalle_venta WHERE venta_id = ?', [id]);
      const [result] = await connection.query('DELETE FROM venta WHERE id = ?', [id]);

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

};

module.exports = Venta;
