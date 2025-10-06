// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Leer el token del header Authorization
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'No se proporcionó token' });

    const token = authHeader.split(' ')[1]; // "Bearer <token>"
    if (!token) return res.status(401).json({ error: 'Token inválido' });

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // guardar datos del usuario en req.user
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
