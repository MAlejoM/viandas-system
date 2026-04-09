import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { IReceta } from '../types';
import { recetaService } from '../services/recetaService';

export default function RecetaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [receta, setReceta] = useState<IReceta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      cargarReceta(parseInt(id));
    }
  }, [id]);

  const cargarReceta = async (recetaId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await recetaService.obtenerPorId(recetaId);
      setReceta(data);
    } catch (err) {
      setError('Error al cargar la receta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      return;
    }

    try {
      if (id) {
        await recetaService.eliminar(parseInt(id));
        navigate('/admin/recetas');
      }
    } catch (err) {
      setError('Error al eliminar la receta');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Cargando receta...</div>
      </div>
    );
  }

  if (!receta) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600 text-lg">Receta no encontrada</p>
        <Link
          to="/admin/recetas"
          className="text-blue-600 hover:text-blue-800 font-bold mt-4 inline-block"
        >
          ← Volver a Recetas
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          to="/admin/recetas"
          className="text-blue-600 hover:text-blue-800 font-bold"
        >
          ← Volver a Recetas
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow">
        {/* Foto */}
        {receta.fotoUrl && (
          <img
            src={receta.fotoUrl}
            alt={receta.nombrePlato}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
        )}

        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {receta.nombrePlato}
        </h1>

        {/* Badges */}
        <div className="flex gap-3 mb-6">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              receta.tipo === 'CARNIVORO'
                ? 'bg-red-100 text-red-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {receta.tipo === 'CARNIVORO' ? '🥩 Carnívoro' : '🥬 Vegetariano'}
          </span>
          {receta.calorias && (
            <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
              {receta.calorias} kcal
            </span>
          )}
        </div>

        {/* Descripción */}
        {receta.descripcion && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">Descripción</h2>
            <p className="text-gray-700 text-lg">{receta.descripcion}</p>
          </div>
        )}

        {/* Ingredientes */}
        {receta.ingredientes && receta.ingredientes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Ingredientes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {receta.ingredientes.map((ing) => (
                <div key={ing.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-900">{ing.ingrediente?.nombre}</p>
                  <p className="text-sm text-gray-600">
                    {(ing as any).cantidad || 'N/A'} {ing.unidadMedida}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {ing.ingrediente?.categoria}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información de auditoría */}
        <div className="border-t pt-6 mb-6 text-sm text-gray-600">
          <p>Creado: {new Date(receta.createdAt).toLocaleDateString()}</p>
          <p>Última actualización: {new Date(receta.updatedAt).toLocaleDateString()}</p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4">
          <Link
            to={`/admin/recetas/${receta.id}/editar`}
            className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded transition-colors text-center"
          >
            Editar
          </Link>
          <button
            onClick={handleEliminar}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
