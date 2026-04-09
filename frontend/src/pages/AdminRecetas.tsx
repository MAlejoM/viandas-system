import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { IReceta } from '../types';
import { recetaService } from '../services/recetaService';

export default function AdminRecetas() {
  const [recetas, setRecetas] = useState<IReceta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  // Se ejecuta cada vez que llegas a esta página
  useEffect(() => {
    cargarRecetas();
  }, [location.pathname]);

  const cargarRecetas = async () => {
    try {
      setLoading(true);
      const data = await recetaService.obtenerTodas();
      setRecetas(data);
    } catch (err) {
      setError('Error al cargar las recetas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      return;
    }

    try {
      await recetaService.eliminar(id);
      setRecetas(recetas.filter((receta) => receta.id !== id));
    } catch (err) {
      setError('Error al eliminar la receta');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Cargando recetas...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Recetas</h1>
        <Link
          to="/admin/recetas/nueva"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          + Nueva Receta
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {recetas.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 text-lg">No hay recetas creadas aún</p>
          <Link
            to="/admin/recetas/nueva"
            className="text-blue-600 hover:text-blue-800 font-bold mt-4 inline-block"
          >
            Crear primera receta →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recetas.map((receta) => (
            <div
              key={receta.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              {receta.fotoUrl && (
                <img
                  src={receta.fotoUrl}
                  alt={receta.nombrePlato}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {receta.nombrePlato}
              </h3>
              <p className="text-gray-600 mb-2">{receta.descripcion}</p>
              <div className="flex justify-between items-center mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    receta.tipo === 'CARNIVORO'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {receta.tipo}
                </span>
                {receta.calorias && (
                  <span className="text-gray-600 text-sm">{receta.calorias} kcal</span>
                )}
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/admin/recetas/${receta.id}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors text-center"
                >
                  Ver
                </Link>
                <Link
                  to={`/admin/recetas/${receta.id}/editar`}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition-colors text-center"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleEliminar(receta.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
