import { Router } from 'express';
import { RecetaController } from '../controllers/recetaController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const recetaController = new RecetaController();

// CRUD Recetas
router.post('/', authMiddleware, (req, res) => recetaController.crear(req, res));
router.get('/', (req, res) => recetaController.obtenerTodas(req, res));
router.get('/tipo/:tipo', (req, res) => recetaController.obtenerPorTipo(req, res));
router.get('/dia/:dia', (req, res) => recetaController.obtenerPorDia(req, res));
router.get('/menu/:menuId/dia/:dia', (req, res) => recetaController.obtenerPorMenuYDia(req, res));
router.get('/menu/:menuId/tipo/:tipo', (req, res) => recetaController.obtenerPorTipoYMenu(req, res));
router.get('/:id', (req, res) => recetaController.obtenerPorId(req, res));
router.put('/:id', authMiddleware, (req, res) => recetaController.actualizar(req, res));
router.delete('/:id', authMiddleware, (req, res) => recetaController.eliminar(req, res));

// Rutas para ingredientes de receta
router.post('/:recetaId/ingredientes', authMiddleware, (req, res) => recetaController.agregarIngrediente(req, res));
router.delete('/:recetaId/ingredientes/:ingredienteId', authMiddleware, (req, res) => recetaController.eliminarIngrediente(req, res));
router.get('/:recetaId/ingredientes', (req, res) => recetaController.obtenerIngredientes(req, res));

export default router;
