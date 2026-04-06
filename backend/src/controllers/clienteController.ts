import { Request, Response } from 'express';
import { ClienteService } from '../services/clienteService';

const clienteService = new ClienteService();

export class ClienteController {
  async crearCliente(req: Request, res: Response) {
    try {
      const cliente = await clienteService.crearCliente(req.body);
      res.status(201).json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear cliente' });
    }
  }

  async obtenerTodos(req: Request, res: Response) {
    try {
      const clientes = await clienteService.obtenerTodos();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener clientes' });
    }
  }

  async obtenerPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cliente = await clienteService.obtenerPorId(parseInt(id));
      if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
      }
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener cliente' });
    }
  }

  async actualizarCliente(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cliente = await clienteService.actualizarCliente(parseInt(id), req.body);
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar cliente' });
    }
  }

  async eliminarCliente(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await clienteService.eliminarCliente(parseInt(id));
      res.json({ message: 'Cliente eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar cliente' });
    }
  }

  async obtenerPorZona(req: Request, res: Response) {
    try {
      const { zona } = req.params;
      const clientes = await clienteService.obtenerClientesPorZona(zona);
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener clientes por zona' });
    }
  }
}
