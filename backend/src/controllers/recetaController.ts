import { Request, Response } from 'express';
import { RecetaService } from '../services/recetaService';

const recetaService = new RecetaService();

export class RecetaController {
  async crear(req: Request, res: Response) {
    try {
      const receta = await recetaService.crear(req.body);
      res.status(201).json(receta);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear receta' });
    }
  }

  async obtenerPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const receta = await recetaService.obtenerPorId(parseInt(id));
      if (!receta) {
        return res.status(404).json({ error: 'Receta no encontrada' });
      }
      res.json(receta);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener receta' });
    }
  }

  async obtenerTodas(req: Request, res: Response) {
    try {
      const recetas = await recetaService.obtenerTodas();
      res.json(recetas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener recetas' });
    }
  }

  async obtenerPorTipo(req: Request, res: Response) {
    try {
      const { tipo } = req.params;
      const recetas = await recetaService.obtenerPorTipo(tipo);
      res.json(recetas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener recetas por tipo' });
    }
  }

  async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const receta = await recetaService.actualizar(parseInt(id), req.body);
      res.json(receta);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar receta' });
    }
  }

  async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await recetaService.eliminar(parseInt(id));
      res.json({ message: 'Receta eliminada' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar receta' });
    }
  }

  async obtenerPorDia(req: Request, res: Response) {
    try {
      const { dia } = req.params;
      const recetas = await recetaService.obtenerPorDia(dia);
      res.json(recetas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener recetas por día' });
    }
  }

  async obtenerPorMenuYDia(req: Request, res: Response) {
    try {
      const { menuId, dia } = req.params;
      const recetas = await recetaService.obtenerPorMenuYDia(parseInt(menuId), dia);
      res.json(recetas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener recetas por menú y día' });
    }
  }

  async obtenerPorTipoYMenu(req: Request, res: Response) {
    try {
      const { menuId, tipo } = req.params;
      const recetas = await recetaService.obtenerPorTipoYMenu(parseInt(menuId), tipo);
      res.json(recetas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener recetas por tipo y menú' });
    }
  }

  async agregarIngrediente(req: Request, res: Response) {
    try {
      const { recetaId } = req.params;
      const recetaIngrediente = await recetaService.agregarIngrediente(parseInt(recetaId), req.body);
      res.status(201).json(recetaIngrediente);
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar ingrediente a receta' });
    }
  }

  async eliminarIngrediente(req: Request, res: Response) {
    try {
      const { recetaId, ingredienteId } = req.params;
      await recetaService.eliminarIngrediente(parseInt(recetaId), parseInt(ingredienteId));
      res.json({ message: 'Ingrediente removido de receta' });
    } catch (error) {
      res.status(500).json({ error: 'Error al remover ingrediente' });
    }
  }

  async obtenerIngredientes(req: Request, res: Response) {
    try {
      const { recetaId } = req.params;
      const ingredientes = await recetaService.obtenerIngredientes(parseInt(recetaId));
      res.json(ingredientes);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener ingredientes' });
    }
  }
}
