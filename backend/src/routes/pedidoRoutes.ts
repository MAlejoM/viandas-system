import { Router } from 'express';
import { PedidoController } from '../controllers/pedidoController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const pedidoController = new PedidoController();

router.post('/', authMiddleware, (req, res) => pedidoController.crearPedido(req, res));
router.get('/', authMiddleware, (req, res) => pedidoController.obtenerTodos(req, res));
router.get('/estado/:estado', authMiddleware, (req, res) => pedidoController.obtenerPorEstado(req, res));
router.get('/cliente/:clienteId', authMiddleware, (req, res) => pedidoController.obtenerPorCliente(req, res));
router.get('/:id', authMiddleware, (req, res) => pedidoController.obtenerPorId(req, res));
router.put('/:id', authMiddleware, (req, res) => pedidoController.actualizarPedido(req, res));
router.delete('/:id', authMiddleware, (req, res) => pedidoController.eliminarPedido(req, res));

export default router;
