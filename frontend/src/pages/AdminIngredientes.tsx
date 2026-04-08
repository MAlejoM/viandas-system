import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IIngrediente } from '../types';
import { ingredienteService } from '../services/ingredienteService';

export default function AdminIngredientes() {
  const [ingredientes, setIngredientes] = useState<IIngrediente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarIngredientes();
  }, []);

  const cargarIngredientes = async () => {
    try {
      setLoading(true);
      const data = await ingredienteService.obtenerTodos();
      setIngredientes(data);
    } catch (err) {
      setError('Error al cargar los ingredientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este ingrediente?')) {
      return;
    }

    try {
      await ingredienteService.eliminar(id);
      setIngredientes(ingredientes.filter((ing) => ing.id !== id));
    } catch (err) {
      setError('Error al eliminar el ingrediente');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Cargando ingredientes...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Ingredientes</h1>
        <Link
          to="/admin/ingredientes/nuevo"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          + Nuevo Ingrediente
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {ingredientes.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 text-lg">No hay ingredientes creados aún</p>
          <Link
            to="/admin/ingredientes/nuevo"
            className="text-blue-600 hover:text-blue-800 font-bold mt-4 inline-block"
          >
            Crear primer ingrediente →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Nombre</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Categoría</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Unidad</th>
                <th className="px-6 py-3 text-left font-bold text-gray-900">Costo/Un</th>
                <th className="px-6 py-3 text-center font-bold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ingredientes.map((ing) => (
                <tr key={ing.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900 font-semibold">{ing.nombre}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {ing.categoria}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{ing.unidadMedida}</td>
                  <td className="px-6 py-4 text-gray-900">${ing.costoUnitario.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/admin/ingredientes/${ing.id}`}
                      className="text-blue-600 hover:text-blue-800 font-bold mr-4"
                    >
                      Ver
                    </Link>
                    <Link
                      to={`/admin/ingredientes/${ing.id}/editar`}
                      className="text-yellow-600 hover:text-yellow-800 font-bold mr-4"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleEliminar(ing.id)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      Eliminar
                    </button>
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
