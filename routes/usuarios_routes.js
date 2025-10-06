const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarios_controllers');
const authMiddleware = require('../middleware/auth'); // opcional, para proteger rutas
const requireMiddleware = require('../middleware/requireAdmin'); // opcional, para proteger rutas
import cors from "cors";

app.use(cors({
  origin: "http://localhost:5173", // tu frontend local
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // si usás cookies o headers de auth
}));
// Rutas públicas
router.post('/login', usuarioController.login); // login sin token
router.post('/', usuarioController.create);    // crear usuario (podés protegerla si solo admin puede crear)

// Rutas protegidas (necesitan token JWT)
router.get('/', authMiddleware, usuarioController.getAll);
router.post('/',authMiddleware, usuarioController.createAdm);    // crear usuario (podés protegerla si solo admin puede crear)

router.get('/:id', authMiddleware, usuarioController.getById);
router.put('/:id', authMiddleware, usuarioController.update);
router.delete('/:id', authMiddleware, usuarioController.delete);

module.exports = router;