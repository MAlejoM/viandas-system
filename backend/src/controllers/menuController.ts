import { Request, Response } from 'express';
import { MenuService } from '../services/menuService';

const menuService = new MenuService();

// Helper para detectar el error de solapamiento del service
const esSolapamiento = (error: unknown): boolean => {
  return error instanceof Error && error.message.startsWith('SOLAPAMIENTO');
};

// Tipado explícito de params para evitar el TS2345 de @types/express
type WithId = Request<{ id: string }>;

export class MenuController {
  async crearMenu(req: Request, res: Response) {
    try {
      const menu = await menuService.crearMenu(req.body);
      res.status(201).json(menu);
    } catch (error) {
      if (esSolapamiento(error)) {
        return res.status(409).json({ error: 'Ya existe un menú para esa semana. Elegí otra fecha de inicio.' });
      }
      console.error('Error al crear menú:', error);
      res.status(500).json({ error: 'Error interno al crear menú' });
    }
  }

  async obtenerTodos(req: Request, res: Response) {
    try {
      const menus = await menuService.obtenerTodos();
      res.json(menus);
    } catch (error) {
      console.error('Error al obtener menús:', error);
      res.status(500).json({ error: 'Error al obtener menús' });
    }
  }

  async obtenerActivos(req: Request, res: Response) {
    try {
      const menus = await menuService.obtenerActivos();
      res.json(menus);
    } catch (error) {
      console.error('Error al obtener menús activos:', error);
      res.status(500).json({ error: 'Error al obtener menús activos' });
    }
  }

  async obtenerPorId(req: WithId, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const menu = await menuService.obtenerPorId(id);
      if (!menu) {
        return res.status(404).json({ error: 'Menú no encontrado' });
      }
      res.json(menu);
    } catch (error) {
      console.error('Error al obtener menú:', error);
      res.status(500).json({ error: 'Error al obtener menú' });
    }
  }

  async actualizarMenu(req: WithId, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const menu = await menuService.actualizarMenu(id, req.body);
      res.json(menu);
    } catch (error) {
      if (esSolapamiento(error)) {
        return res.status(409).json({ error: 'Ya existe un menú para esa semana. Elegí otra fecha de inicio.' });
      }
      console.error('Error al actualizar menú:', error);
      res.status(500).json({ error: 'Error interno al actualizar menú' });
    }
  }

  async publicarMenu(req: WithId, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const menu = await menuService.publicarMenu(id);
      res.json(menu);
    } catch (error) {
      console.error('Error al publicar menú:', error);
      res.status(500).json({ error: 'Error al publicar menú' });
    }
  }

  async clonarMenu(req: WithId, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { nuevaFechaInicioSemana } = req.body;

      if (!nuevaFechaInicioSemana) {
        return res.status(400).json({ error: 'nuevaFechaInicioSemana es requerida en el body' });
      }

      const nuevoMenu = await menuService.clonarMenu(id, nuevaFechaInicioSemana);
      res.status(201).json(nuevoMenu);
    } catch (error) {
      if (esSolapamiento(error)) {
        return res.status(409).json({ error: 'Ya existe un menú para la semana de destino. Elegí otra fecha.' });
      }
      if (error instanceof Error && error.message === 'Menú origen no encontrado') {
        return res.status(404).json({ error: 'Menú origen no encontrado' });
      }
      console.error('Error al clonar menú:', error);
      res.status(500).json({ error: 'Error interno al clonar menú' });
    }
  }

  async eliminarMenu(req: WithId, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await menuService.eliminarMenu(id);
      res.json({ message: 'Menú eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar menú:', error);
      res.status(500).json({ error: 'Error al eliminar menú' });
    }
  }
}
