import { Router } from 'express';
import { PedidoController } from '../controllers/pedidoController';
// TODO: Reactivar authMiddleware cuando se implemente el login en el frontend
// import { authMiddleware } from '../middleware/auth';

const router = Router();
const pedidoController = new PedidoController();

router.post('/', (req, res) => pedidoController.crearPedido(req, res));
router.get('/', (req, res) => pedidoController.obtenerTodos(req, res));
router.get('/estado/:estado', (req, res) => pedidoController.obtenerPorEstado(req, res));
router.get('/cliente/:clienteId', (req, res) => pedidoController.obtenerPorCliente(req, res));
router.get('/:id', (req, res) => pedidoController.obtenerPorId(req, res));
router.put('/:id', (req, res) => pedidoController.actualizarPedido(req, res));
router.delete('/:id', (req, res) => pedidoController.eliminarPedido(req, res));

export default router;
