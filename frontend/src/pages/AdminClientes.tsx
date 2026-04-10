import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useClientes } from '../hooks/useClientes';
import { EstadoClienteBadge, ZonaBadge } from '../components/Badges';

export default function AdminClientes() {
  const { clientes, loading, error, fetchClientes } = useClientes();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    void fetchClientes();
  }, [fetchClientes]);

  const filteredClientes = clientes.filter(cliente => 
    `${cliente.nombre} ${cliente.apellido}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefono.includes(searchTerm) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
        <Link
          to="/admin/clientes/nuevo"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors"
        >
          + Nuevo Cliente
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre, teléfono o email..."
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {filteredClientes.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm text-center border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-xl font-medium">No se encontraron clientes</p>
          <p className="text-gray-400 mb-6">Prueba con otro término de búsqueda o crea uno nuevo</p>
          <Link
            to="/admin/clientes/nuevo"
            className="text-blue-600 hover:text-blue-800 font-bold"
          >
            Crear cliente →
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Zona / Entrega</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{cliente.nombre} {cliente.apellido}</div>
                    <div className="text-xs text-gray-500">{cliente.direccion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{cliente.telefono}</div>
                    <div className="text-xs text-gray-500">{cliente.email || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ZonaBadge zona={cliente.zona} />
                    <div className="text-xs text-gray-500 mt-1">{cliente.preferenciaEntrega}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <EstadoClienteBadge estado={cliente.estado} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <div className="flex justify-center gap-3">
                      <Link
                        to={`/admin/clientes/${cliente.id}`}
                        className="text-blue-600 hover:text-blue-900 font-bold"
                      >
                        Ver
                      </Link>
                      <Link
                        to={`/admin/clientes/${cliente.id}/editar`}
                        className="text-yellow-600 hover:text-yellow-900 font-bold"
                      >
                        Editar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
