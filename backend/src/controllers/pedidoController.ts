import { Request, Response } from 'express';
import { PedidoService } from '../services/pedidoService';

const pedidoService = new PedidoService();

export class PedidoController {
  async crearPedido(req: Request, res: Response) {
    try {
      const pedido = await pedidoService.crearPedido(req.body);
      res.status(201).json(pedido);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear pedido' });
    }
  }

  async obtenerTodos(req: Request, res: Response) {
    try {
      const pedidos = await pedidoService.obtenerTodos();
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener pedidos' });
    }
  }

  async obtenerPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pedido = await pedidoService.obtenerPorId(parseInt(id));
      if (!pedido) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }
      res.json(pedido);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener pedido' });
    }
  }

  async obtenerPorCliente(req: Request, res: Response) {
    try {
      const { clienteId } = req.params;
      const pedidos = await pedidoService.obtenerPorCliente(parseInt(clienteId));
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener pedidos del cliente' });
    }
  }

  async obtenerPorEstado(req: Request, res: Response) {
    try {
      const { estado } = req.params;
      const pedidos = await pedidoService.obtenerPorEstado(estado);
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener pedidos por estado' });
    }
  }

  async actualizarPedido(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const pedido = await pedidoService.actualizarPedido(parseInt(id), req.body);
      res.json(pedido);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar pedido' });
    }
  }

  async eliminarPedido(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await pedidoService.eliminarPedido(parseInt(id));
      res.json({ message: 'Pedido eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar pedido' });
    }
  }
}
