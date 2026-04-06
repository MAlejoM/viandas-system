import { Request, Response } from 'express';
import { MenuService } from '../services/menuService';

const menuService = new MenuService();

export class MenuController {
  async crearMenu(req: Request, res: Response) {
    try {
      const menu = await menuService.crearMenu(req.body);
      res.status(201).json(menu);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear menú' });
    }
  }

  async obtenerTodos(req: Request, res: Response) {
    try {
      const menus = await menuService.obtenerTodos();
      res.json(menus);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener menús' });
    }
  }

  async obtenerActivos(req: Request, res: Response) {
    try {
      const menus = await menuService.obtenerActivos();
      res.json(menus);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener menús activos' });
    }
  }

  async obtenerPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const menu = await menuService.obtenerPorId(parseInt(id));
      if (!menu) {
        return res.status(404).json({ error: 'Menú no encontrado' });
      }
      res.json(menu);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener menú' });
    }
  }

  async actualizarMenu(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const menu = await menuService.actualizarMenu(parseInt(id), req.body);
      res.json(menu);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar menú' });
    }
  }

  async eliminarMenu(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await menuService.eliminarMenu(parseInt(id));
      res.json({ message: 'Menú eliminado' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar menú' });
    }
  }
}
