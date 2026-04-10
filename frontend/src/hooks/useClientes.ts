import { useState, useCallback } from 'react';
import type { ICliente } from '../types';
import { clienteService } from '../services/clienteService';

export const useClientes = () => {
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [cliente, setCliente] = useState<ICliente | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clienteService.obtenerTodos();
      setClientes(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClienteById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await clienteService.obtenerPorId(id);
      setCliente(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al cargar el cliente');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCliente = async (id: number) => {
    try {
      setError(null);
      await clienteService.eliminar(id);
      setClientes(prev => prev.filter(c => c.id !== id));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al eliminar el cliente');
      return false;
    }
  };

  return {
    clientes,
    cliente,
    loading,
    error,
    fetchClientes,
    fetchClienteById,
    deleteCliente,
    setClientes
  };
};
