import { Request, Response } from 'express';
import { IngredienteService } from '../services/ingredienteService';

const ingredienteService = new IngredienteService();

export class IngredienteController {
  async crear(req: Request, res: Response) {
    try {
      const ingrediente = await ingredienteService.crear(req.body);
      res.status(201).json(ingrediente);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear ingrediente' });
    }
  }

  async obtenerPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ingrediente = await ingredienteService.obtenerPorId(parseInt(id));
      if (!ingrediente) {
        return res.status(404).json({ error: 'Ingrediente no encontrado' });
      }
      res.json(ingrediente);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener ingrediente' });
    }
  }

  async obtenerTodos(req: Request, res: Response) {
    try {
      const ingredientes = await ingredienteService.obtenerTodos();
      res.json(ingredientes);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener ingredientes' });
    }
  }

  async obtenerPorCategoria(req: Request, res: Response) {
    try {
      const { categoria } = req.params;
      const ingredientes = await ingredienteService.obtenerPorCategoria(categoria);
      res.json(ingredientes);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener ingredientes por categoría' });
    }
  }

  async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ingrediente = await ingredienteService.actualizar(parseInt(id), req.body);
      res.json(ingrediente);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar ingrediente' });
    }
  }

  async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ingredienteService.eliminar(parseInt(id));
      res.json({ message: 'Ingrediente eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar ingrediente' });
    }
  }
}
