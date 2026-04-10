import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useClientes } from '../hooks/useClientes';
import { EstadoClienteBadge } from '../components/Badges';

export default function ClienteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cliente, loading, error, fetchClienteById, deleteCliente } = useClientes();

  useEffect(() => {
    if (id) {
      void fetchClienteById(parseInt(id));
    }
  }, [id, fetchClienteById]);

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      return;
    }

    if (id) {
      const success = await deleteCliente(parseInt(id));
      if (success) navigate('/admin/clientes');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600 text-lg">Cliente no encontrado</p>
        <Link to="/admin/clientes" className="text-blue-600 hover:text-blue-800 font-bold mt-4 inline-block">
          ← Volver a Clientes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/admin/clientes" className="text-blue-600 hover:text-blue-800 font-bold">
          ← Volver a Clientes
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 border-b-4 border-blue-600 inline-block pb-1">
              {cliente.nombre} {cliente.apellido}
            </h1>
            <div className="flex items-center gap-2 mt-4">
              <EstadoClienteBadge estado={cliente.estado} />
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-bold rounded-full">
                ID: {cliente.id}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/admin/clientes/${cliente.id}/editar`}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded transition-colors"
            >
              Editar
            </Link>
            <button
              onClick={handleEliminar}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-lg font-bold text-blue-900 mb-4 border-b border-blue-200 pb-2">Información de Contacto</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-blue-700 uppercase">Teléfono</p>
                <p className="text-xl font-bold text-blue-900">{cliente.telefono}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-700 uppercase">Email</p>
                <p className="text-xl font-bold text-blue-900">{cliente.email || 'No registrado'}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-lg font-bold text-green-900 mb-4 border-b border-green-200 pb-2">Logística y Entrega</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-green-700 uppercase">Dirección</p>
                <p className="text-xl font-bold text-green-900">{cliente.direccion}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase">Zona</p>
                  <p className="text-lg font-bold text-green-900">{cliente.zona}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-green-700 uppercase">Preferencia</p>
                  <p className="text-lg font-bold text-green-900">{cliente.preferenciaEntrega}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 mb-8">
          <h2 className="text-lg font-bold text-yellow-900 mb-2 uppercase text-xs tracking-wider">Restricciones Médicas y Notas</h2>
          <p className="text-xl text-yellow-900 font-medium italic">
            {cliente.restriccionesMedicas || 'Sin restricciones informadas.'}
          </p>
        </div>

        <div className="border-t pt-6 text-sm text-gray-500 flex justify-between">
          <p>Cliente desde: {new Date(cliente.fechaRegistro).toLocaleDateString()}</p>
          <p>ID: #{cliente.id}</p>
        </div>
      </div>
    </div>
  );
}
