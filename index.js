const express = require("express");

const usuarioRoutes = require("./routes/usuarios_routes")
const productosRoutes = require("./routes/productos_routes")
const ventasRoutes= require("./routes/ventas_routes")
require("dotenv").config();
const cors = require("cors")

const app = express();

app.use(express.json());
app.use(cors({
  origin: "https://crm.scollopilar.com",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
// Rutas

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productosRoutes);
app.use('/api/ventas', ventasRoutes);
const PORT = process.env.PORT;
if (!PORT) {
  console.error('No se encontró process.env.PORT');
  process.exit(1); // detiene la app si no hay puerto
}

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

