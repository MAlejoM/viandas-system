import { Router } from 'express';
import { RecetaController } from '../controllers/recetaController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const recetaController = new RecetaController();

router.post('/', authMiddleware, (req, res) => recetaController.crear(req, res));
router.get('/', (req, res) => recetaController.obtenerTodas(req, res));
router.get('/:id', (req, res) => recetaController.obtenerPorId(req, res));
router.get('/menu/:menuId', (req, res) => recetaController.obtenerPorMenu(req, res));
router.put('/:id', authMiddleware, (req, res) => recetaController.actualizar(req, res));
router.delete('/:id', authMiddleware, (req, res) => recetaController.eliminar(req, res));

// Rutas para ingredientes de receta
router.post('/:recetaId/ingredientes', authMiddleware, (req, res) => recetaController.agregarIngrediente(req, res));
router.delete('/:recetaId/ingredientes/:ingredienteId', authMiddleware, (req, res) => recetaController.eliminarIngrediente(req, res));
router.get('/:recetaId/ingredientes', (req, res) => recetaController.obtenerIngredientes(req, res));

export default router;
