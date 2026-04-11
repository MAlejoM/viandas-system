import { apiClient } from './apiClient';
import type { IMenuSemanal, IMenuReceta, FormMenu, DiaSemana } from '../types';

const BASE_URL = '/menus';
const RECETAS_URL = '/menus-recetas';

class MenuService {
  // ========================================
  // CRUD de MenuSemanal
  // ========================================

  /**
   * Obtiene todos los menús ordenados por fecha descendente.
   */
  async obtenerTodos(): Promise<IMenuSemanal[]> {
    try {
      const response = await apiClient.instance.get<IMenuSemanal[]>(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error al obtener menús:', error);
      throw error;
    }
  }

  /**
   * Obtiene un menú por ID (incluye recetas asociadas).
   */
  async obtenerPorId(id: number): Promise<IMenuSemanal> {
    try {
      const response = await apiClient.instance.get<IMenuSemanal>(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener menú ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo menú en estado BORRADOR.
   * Lanza un error con status 409 si la semana ya tiene un menú.
   */
  async crear(datos: FormMenu): Promise<IMenuSemanal> {
    try {
      const response = await apiClient.instance.post<IMenuSemanal>(BASE_URL, datos);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear menú:', error);
      throw error;
    }
  }

  /**
   * Actualiza los datos base de un menú (solo aplica a BORRADOR).
   */
  async actualizar(id: number, datos: Partial<FormMenu>): Promise<IMenuSemanal> {
    try {
      const response = await apiClient.instance.put<IMenuSemanal>(`${BASE_URL}/${id}`, datos);
      return response.data;
    } catch (error: any) {
      console.error(`Error al actualizar menú ${id}:`, error);
      throw error;
    }
  }

  /**
   * Publica un menú: cambia estado a PUBLICADO.
   */
  async publicar(id: number): Promise<IMenuSemanal> {
    try {
      const response = await apiClient.instance.patch<IMenuSemanal>(`${BASE_URL}/${id}/publicar`);
      return response.data;
    } catch (error) {
      console.error(`Error al publicar menú ${id}:`, error);
      throw error;
    }
  }

  /**
   * Clona un menú hacia una nueva semana. Devuelve el nuevo menú en BORRADOR.
   */
  async clonar(menuOrigenId: number, nuevaFechaInicioSemana: string): Promise<IMenuSemanal> {
    try {
      const response = await apiClient.instance.post<IMenuSemanal>(
        `${BASE_URL}/${menuOrigenId}/clonar`,
        { nuevaFechaInicioSemana }
      );
      return response.data;
    } catch (error: any) {
      console.error(`Error al clonar menú ${menuOrigenId}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un menú y sus asignaciones de recetas.
   */
  async eliminar(id: number): Promise<void> {
    try {
      await apiClient.instance.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(`Error al eliminar menú ${id}:`, error);
      throw error;
    }
  }

  // ========================================
  // Gestión de recetas por día (MenuReceta)
  // ========================================

  /**
   * Obtiene todas las asignaciones de recetas de un menú.
   */
  async obtenerRecetas(menuId: number): Promise<IMenuReceta[]> {
    try {
      const response = await apiClient.instance.get<IMenuReceta[]>(`${RECETAS_URL}/${menuId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener recetas del menú ${menuId}:`, error);
      throw error;
    }
  }

  /**
   * Asigna una receta a un día específico del menú.
   */
  async asignarReceta(menuId: number, recetaId: number, diaSemana: DiaSemana): Promise<IMenuReceta> {
    try {
      const response = await apiClient.instance.post<IMenuReceta>(
        `${RECETAS_URL}/${menuId}/${recetaId}`,
        { diaSemana }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al asignar receta ${recetaId} al menú ${menuId} (${diaSemana}):`, error);
      throw error;
    }
  }

  /**
   * Remueve la asignación de una receta de un menú.
   */
  async removerReceta(menuId: number, recetaId: number): Promise<void> {
    try {
      await apiClient.instance.delete(`${RECETAS_URL}/${menuId}/${recetaId}`);
    } catch (error) {
      console.error(`Error al remover receta ${recetaId} del menú ${menuId}:`, error);
      throw error;
    }
  }
}

export const menuService = new MenuService();
export default menuService;
