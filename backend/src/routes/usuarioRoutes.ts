import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const usuarioController = new UsuarioController();

// Rutas públicas — no requieren token
router.post('/registro', (req, res) => usuarioController.registro(req, res));
router.post('/login', (req, res) => usuarioController.login(req, res));

// Rutas protegidas — requieren token JWT
router.get('/perfil', authMiddleware, (req, res) => usuarioController.obtenerPerfil(req, res));
router.get('/', authMiddleware, (req, res) => usuarioController.obtenerTodos(req, res));

export default router;
