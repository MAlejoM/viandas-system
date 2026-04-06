import { Router } from 'express';
import { IngredienteController } from '../controllers/ingredienteController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const ingredienteController = new IngredienteController();

router.post('/', authMiddleware, (req, res) => ingredienteController.crear(req, res));
router.get('/', (req, res) => ingredienteController.obtenerTodos(req, res));
router.get('/categoria/:categoria', (req, res) => ingredienteController.obtenerPorCategoria(req, res));
router.get('/:id', (req, res) => ingredienteController.obtenerPorId(req, res));
router.put('/:id', authMiddleware, (req, res) => ingredienteController.actualizar(req, res));
router.delete('/:id', authMiddleware, (req, res) => ingredienteController.eliminar(req, res));

export default router;
