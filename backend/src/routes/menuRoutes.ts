import { Router } from 'express';
import { MenuController } from '../controllers/menuController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const menuController = new MenuController();

router.post('/', authMiddleware, (req, res) => menuController.crearMenu(req, res));
router.get('/', (req, res) => menuController.obtenerTodos(req, res));
router.get('/activos', (req, res) => menuController.obtenerActivos(req, res));
router.get('/:id', (req, res) => menuController.obtenerPorId(req, res));
router.put('/:id', authMiddleware, (req, res) => menuController.actualizarMenu(req, res));
router.delete('/:id', authMiddleware, (req, res) => menuController.eliminarMenu(req, res));

export default router;
