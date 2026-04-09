import { Router } from 'express';
import { MenuRecetaController } from '../controllers/menuRecetaController';
// TODO: Reactivar authMiddleware cuando se implemente el login en el frontend
// import { authMiddleware } from '../middleware/auth';

const router = Router();
const menuRecetaController = new MenuRecetaController();

// Asignar receta a menú en día específico
router.post('/:menuId/:recetaId', (req, res) => menuRecetaController.asignarRecetaAlMenu(req, res));

// Obtener recetas de un menú
router.get('/:menuId', (req, res) => menuRecetaController.obtenerRecetasDelMenu(req, res));

// Obtener recetas de un menú por día específico
router.get('/:menuId/dia/:diaSemana', (req, res) => menuRecetaController.obtenerRecetasDelMenuPorDia(req, res));

// Remover receta del menú
router.delete('/:menuId/:recetaId', (req, res) => menuRecetaController.removerRecetaDelMenu(req, res));

// Actualizar día de receta en menú
router.put('/:menuId/:recetaId/dia', (req, res) => menuRecetaController.actualizarDiaReceta(req, res));

export default router;
