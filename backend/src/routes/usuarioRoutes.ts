import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const usuarioController = new UsuarioController();

// Rutas públicas
router.post('/registro', (req, res) => usuarioController.registro(req, res));
router.post('/login', (req, res) => usuarioController.login(req, res));

// Rutas protegidas
// TODO: Reactivar authMiddleware cuando se implemente el login en el frontend
// router.get('/perfil', authMiddleware, (req, res) => usuarioController.obtenerPerfil(req, res));
// router.get('/', authMiddleware, (req, res) => usuarioController.obtenerTodos(req, res));
router.get('/perfil', (req, res) => usuarioController.obtenerPerfil(req, res));
router.get('/', (req, res) => usuarioController.obtenerTodos(req, res));

export default router;
