import { apiClient } from './apiClient';
import type { ICliente } from '../types';

export const clienteService = {
  /**
   * Obtiene todos los clientes registrados
   */
  obtenerTodos: async (): Promise<ICliente[]> => {
    try {
      const response = await apiClient.get<ICliente[]>('/clientes');
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  },

  /**
   * Obtiene un cliente por su ID
   */
  obtenerPorId: async (id: number): Promise<ICliente> => {
    try {
      const response = await apiClient.get<ICliente>(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener cliente ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo cliente
   */
  crear: async (cliente: Omit<ICliente, 'id' | 'fechaRegistro' | 'updatedAt'>): Promise<ICliente> => {
    try {
      const response = await apiClient.post<ICliente>('/clientes', cliente);
      return response.data;
    } catch (error) {
      console.error('Error al crear cliente:', error);
      throw error;
    }
  },

  /**
   * Actualiza los datos de un cliente existente
   */
  actualizar: async (id: number, cliente: Partial<ICliente>): Promise<ICliente> => {
    try {
      const response = await apiClient.put<ICliente>(`/clientes/${id}`, cliente);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar cliente ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina (o desactiva) un cliente
   */
  eliminar: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/clientes/${id}`);
    } catch (error) {
      console.error(`Error al eliminar cliente ${id}:`, error);
      throw error;
    }
  }
};
