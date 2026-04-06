import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usuarioRoutes from './routes/usuarioRoutes';
import clienteRoutes from './routes/clienteRoutes';
import menuRoutes from './routes/menuRoutes';
import pedidoRoutes from './routes/pedidoRoutes';
import recetaRoutes from './routes/recetaRoutes';
import ingredienteRoutes from './routes/ingredienteRoutes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API de Viandas funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas principales
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/recetas', recetaRoutes);
app.use('/api/ingredientes', ingredienteRoutes);

// Manejador de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.path
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\nRutas disponibles:`);
  console.log(`  GET  /api/health`);
  console.log(`  POST /api/usuarios/registro`);
  console.log(`  POST /api/usuarios/login`);
  console.log(`  GET  /api/clientes`);
  console.log(`  GET  /api/menus`);
  console.log(`  GET  /api/pedidos`);
  console.log(`  GET  /api/recetas`);
  console.log(`  GET  /api/ingredientes`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('error no maejado:', err);
  process.exit(1);
});