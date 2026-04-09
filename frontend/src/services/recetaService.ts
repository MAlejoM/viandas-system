import { apiClient } from './apiClient';
import type { IReceta, FormaReceta, IRecetaIngrediente, FormRecetaIngrediente, TipoReceta, DiaSemana } from '../types';


class RecetaService {
  private baseURL = '/recetas';

  /**
   * Obtener todas las recetas
   */
  async obtenerTodas(): Promise<IReceta[]> {
    try {
      const response = await apiClient.instance.get<IReceta[]>(this.baseURL);
      return response.data;
    } catch (error) {
      console.error('Error al obtener recetas:', error);
      throw error;
    }
  }

  /**
   * Obtener receta por ID
   */
  async obtenerPorId(id: number): Promise<IReceta> {
    try {
      const response = await apiClient.instance.get<IReceta>(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener receta ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtener recetas por tipo
   */
  async obtenerPorTipo(tipo: TipoReceta): Promise<IReceta[]> {
    try {
      const response = await apiClient.instance.get<IReceta[]>(`${this.baseURL}/tipo/${tipo}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener recetas tipo ${tipo}:`, error);
      throw error;
    }
  }

  /**
   * Obtener recetas por día de la semana
   */
  async obtenerPorDia(dia: DiaSemana): Promise<IReceta[]> {
    try {
      const response = await apiClient.instance.get<IReceta[]>(`${this.baseURL}/dia/${dia}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener recetas del ${dia}:`, error);
      throw error;
    }
  }

  /**
   * Obtener recetas de un menú por día
   */
  async obtenerPorMenuYDia(menuId: number, dia: DiaSemana): Promise<IReceta[]> {
    try {
      const response = await apiClient.instance.get<IReceta[]>(
        `${this.baseURL}/menu/${menuId}/dia/${dia}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener recetas del menú ${menuId} en ${dia}:`, error);
      throw error;
    }
  }

  /**
   * Obtener recetas de un menú por tipo
   */
  async obtenerPorTipoYMenu(menuId: number, tipo: TipoReceta): Promise<IReceta[]> {
    try {
      const response = await apiClient.instance.get<IReceta[]>(
        `${this.baseURL}/menu/${menuId}/tipo/${tipo}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener recetas tipo ${tipo} del menú ${menuId}:`, error);
      throw error;
    }
  }

  /**
   * Crear una nueva receta
   */
  async crear(receta: FormaReceta): Promise<IReceta> {
    try {
      console.log('📤 Enviando receta al servidor:', receta);
      const response = await apiClient.instance.post<IReceta>(this.baseURL, receta);
      console.log('✅ Receta creada exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Error al crear receta:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Datos:', error.response.data);
      }
      throw error;
    }
  }

  /**
   * Actualizar una receta
   */
  async actualizar(id: number, receta: Partial<FormaReceta>): Promise<IReceta> {
    try {
      console.log('📤 Actualizando receta en servidor:', { id, receta });
      const response = await apiClient.instance.put<IReceta>(`${this.baseURL}/${id}`, receta);
      console.log('✅ Receta actualizada exitosamente:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Error al actualizar receta ${id}:`, error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Datos:', error.response.data);
      }
      throw error;
    }
  }

  /**
   * Eliminar una receta
   */
  async eliminar(id: number): Promise<void> {
    try {
      console.log('📤 Eliminando receta:', id);
      await apiClient.instance.delete(`${this.baseURL}/${id}`);
      console.log('✅ Receta eliminada exitosamente');
    } catch (error: any) {
      console.error(`❌ Error al eliminar receta ${id}:`, error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Datos:', error.response.data);
      }
      throw error;
    }
  }

  /**
   * Obtener ingredientes de una receta
   */
  async obtenerIngredientes(recetaId: number): Promise<IRecetaIngrediente[]> {
    try {
      const response = await apiClient.instance.get<IRecetaIngrediente[]>(
        `${this.baseURL}/${recetaId}/ingredientes`
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener ingredientes de receta ${recetaId}:`, error);
      throw error;
    }
  }

  /**
   * Agregar ingrediente a una receta
   */
  async agregarIngrediente(recetaId: number, ingrediente: FormRecetaIngrediente): Promise<IRecetaIngrediente> {
    try {
      const response = await apiClient.instance.post<IRecetaIngrediente>(
        `${this.baseURL}/${recetaId}/ingredientes`,
        ingrediente
      );
      return response.data;
    } catch (error) {
      console.error(`Error al agregar ingrediente a receta ${recetaId}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar ingrediente de una receta
   */
  async eliminarIngrediente(recetaId: number, ingredienteId: number): Promise<void> {
    try {
      await apiClient.instance.delete(
        `${this.baseURL}/${recetaId}/ingredientes/${ingredienteId}`
      );
    } catch (error) {
      console.error(
        `Error al eliminar ingrediente ${ingredienteId} de receta ${recetaId}:`,
        error
      );
      throw error;
    }
  }
}

export const recetaService = new RecetaService();
export default recetaService;
