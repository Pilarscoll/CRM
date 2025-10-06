const express = require("express");
const cors = require("cors");
const usuarioRoutes = require("./routes/usuarios_routes")
const productosRoutes = require("./routes/productos_routes")
const ventasRoutes= require("./routes/ventas_routes")
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/productos", productosRoutes);
app.use('/api/ventas', ventasRoutes);
const PORT = process.env.PORT || 8080; // usa el puerto de Railway si existe

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
