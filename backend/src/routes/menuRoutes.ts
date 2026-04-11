import { Router } from 'express';
import { MenuController } from '../controllers/menuController';
// TODO: Reactivar authMiddleware cuando se implemente el login en el frontend
// import { authMiddleware } from '../middleware/auth';

const router = Router();
const menuController = new MenuController();

// CRUD base
router.post('/', (req, res) => menuController.crearMenu(req, res));
router.get('/', (req, res) => menuController.obtenerTodos(req, res));
router.get('/activos', (req, res) => menuController.obtenerActivos(req, res));
router.get('/:id', (req, res) => menuController.obtenerPorId(req, res));
router.put('/:id', (req, res) => menuController.actualizarMenu(req, res));
router.delete('/:id', (req, res) => menuController.eliminarMenu(req, res));

// Acciones de estado
router.patch('/:id/publicar', (req, res) => menuController.publicarMenu(req, res));
router.post('/:id/clonar', (req, res) => menuController.clonarMenu(req, res));

export default router;
