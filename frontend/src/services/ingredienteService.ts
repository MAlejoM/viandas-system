import { apiClient } from './apiClient';
import { IIngrediente, FormIngrediente, CategoriaIngrediente } from '../types';

class IngredienteService {
  private baseURL = '/ingredientes';

  /**
   * Obtener todos los ingredientes
   */
  async obtenerTodos(): Promise<IIngrediente[]> {
    try {
      const response = await apiClient.instance.get<IIngrediente[]>(this.baseURL);
      return response.data;
    } catch (error) {
      console.error('Error al obtener ingredientes:', error);
      throw error;
    }
  }

  /**
   * Obtener ingrediente por ID
   */
  async obtenerPorId(id: number): Promise<IIngrediente> {
    try {
      const response = await apiClient.instance.get<IIngrediente>(`${this.baseURL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener ingrediente ${id}:`, error);
      throw error;
    }
  }

  /**
   * Buscar ingredientes por nombre
   */
  async obtenerPorNombre(nombre: string): Promise<IIngrediente[]> {
    try {
      const response = await apiClient.instance.get<IIngrediente[]>(
        `${this.baseURL}/search`,
        { params: { nombre } }
      );
      return response.data;
    } catch (error) {
      console.error(`Error al buscar ingredientes por nombre "${nombre}":`, error);
      throw error;
    }
  }

  /**
   * Obtener ingredientes por categoría
   */
  async obtenerPorCategoria(categoria: CategoriaIngrediente): Promise<IIngrediente[]> {
    try {
      const response = await apiClient.instance.get<IIngrediente[]>(
        `${this.baseURL}/categoria/${categoria}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error al obtener ingredientes de categoría ${categoria}:`, error);
      throw error;
    }
  }

  /**
   * Crear un nuevo ingrediente
   */
  async crear(ingrediente: FormIngrediente): Promise<IIngrediente> {
    try {
      const response = await apiClient.instance.post<IIngrediente>(this.baseURL, ingrediente);
      return response.data;
    } catch (error) {
      console.error('Error al crear ingrediente:', error);
      throw error;
    }
  }

  /**
   * Actualizar un ingrediente
   */
  async actualizar(id: number, ingrediente: Partial<FormIngrediente>): Promise<IIngrediente> {
    try {
      const response = await apiClient.instance.put<IIngrediente>(
        `${this.baseURL}/${id}`,
        ingrediente
      );
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar ingrediente ${id}:`, error);
      throw error;
    }
  }

  /**
   * Eliminar un ingrediente
   */
  async eliminar(id: number): Promise<void> {
    try {
      await apiClient.instance.delete(`${this.baseURL}/${id}`);
    } catch (error) {
      console.error(`Error al eliminar ingrediente ${id}:`, error);
      throw error;
    }
  }
}

export const ingredienteService = new IngredienteService();
export default ingredienteService;
