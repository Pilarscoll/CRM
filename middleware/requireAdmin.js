// middleware/requireAdmin.js
module.exports = (req, res, next) => {
    console.log(req.user);
    console.log('ROL EN TOKEN:', req.user.rol, typeof req.user.rol);
  if (!req.user) return res.status(401).json({ error: 'No autenticado' });
  if (req.user.rol != 1) return res.status(403).json({ error: 'No autorizado' });
  next();
};
