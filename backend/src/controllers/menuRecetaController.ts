import { Request, Response } from 'express';
import { MenuRecetaService } from '../services/menuRecetaService';

const menuRecetaService = new MenuRecetaService();

export class MenuRecetaController {
  async asignarRecetaAlMenu(req: Request, res: Response) {
    try {
      const { menuId, recetaId } = req.params;
      const { diaSemana } = req.body;
      const resultado = await menuRecetaService.asignarRecetaAlMenu(parseInt(menuId), parseInt(recetaId), diaSemana);
      res.status(201).json(resultado);
    } catch (error) {
      res.status(500).json({ error: 'Error al asignar receta al menú' });
    }
  }

  async obtenerRecetasDelMenu(req: Request, res: Response) {
    try {
      const { menuId } = req.params;
      const recetas = await menuRecetaService.obtenerRecetasDelMenu(parseInt(menuId));
      res.json(recetas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener recetas del menú' });
    }
  }

  async obtenerRecetasDelMenuPorDia(req: Request, res: Response) {
    try {
      const { menuId, diaSemana } = req.params;
      const recetas = await menuRecetaService.obtenerRecetasDelMenuPorDia(parseInt(menuId), diaSemana);
      res.json(recetas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener recetas del menú por día' });
    }
  }

  async removerRecetaDelMenu(req: Request, res: Response) {
    try {
      const { menuId, recetaId } = req.params;
      await menuRecetaService.removerRecetaDelMenu(parseInt(menuId), parseInt(recetaId));
      res.json({ message: 'Receta removida del menú' });
    } catch (error) {
      res.status(500).json({ error: 'Error al remover receta del menú' });
    }
  }

  async actualizarDiaReceta(req: Request, res: Response) {
    try {
      const { menuId, recetaId } = req.params;
      const { diaSemana } = req.body;
      if (!diaSemana) {
        return res.status(400).json({ error: 'diaSemana es requerido en el body' });
      }
      const resultado = await menuRecetaService.actualizarDiaReceta(parseInt(menuId), parseInt(recetaId), diaSemana);
      res.json(resultado);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar día de receta' });
    }
  }
}
