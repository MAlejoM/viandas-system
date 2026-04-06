import { Router } from 'express';
import { ClienteController } from '../controllers/clienteController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const clienteController = new ClienteController();

router.post('/', authMiddleware, (req, res) => clienteController.crearCliente(req, res));
router.get('/', authMiddleware, (req, res) => clienteController.obtenerTodos(req, res));
router.get('/zona/:zona', authMiddleware, (req, res) => clienteController.obtenerPorZona(req, res));
router.get('/:id', authMiddleware, (req, res) => clienteController.obtenerPorId(req, res));
router.put('/:id', authMiddleware, (req, res) => clienteController.actualizarCliente(req, res));
router.delete('/:id', authMiddleware, (req, res) => clienteController.eliminarCliente(req, res));

export default router;
