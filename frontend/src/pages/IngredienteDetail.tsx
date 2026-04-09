import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { IIngrediente } from '../types';
import { ingredienteService } from '../services/ingredienteService';

export default function IngredienteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [ingrediente, setIngrediente] = useState<IIngrediente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      cargarIngrediente(parseInt(id));
    }
  }, [id]);

  const cargarIngrediente = async (ingredienteId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ingredienteService.obtenerPorId(ingredienteId);
      setIngrediente(data);
    } catch (err) {
      setError('Error al cargar el ingrediente');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este ingrediente?')) {
      return;
    }

    try {
      if (id) {
        await ingredienteService.eliminar(parseInt(id));
        navigate('/admin/ingredientes');
      }
    } catch (err) {
      setError('Error al eliminar el ingrediente');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Cargando ingrediente...</div>
      </div>
    );
  }

  if (!ingrediente) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600 text-lg">Ingrediente no encontrado</p>
        <Link
          to="/admin/ingredientes"
          className="text-blue-600 hover:text-blue-800 font-bold mt-4 inline-block"
        >
          ← Volver a Ingredientes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          to="/admin/ingredientes"
          className="text-blue-600 hover:text-blue-800 font-bold"
        >
          ← Volver a Ingredientes
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow">
        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {ingrediente.nombre}
        </h1>

        {/* Información principal */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-700 mb-2">Categoría</p>
            <p className="text-2xl font-bold text-blue-900">{ingrediente.categoria}</p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <p className="text-sm font-semibold text-green-700 mb-2">Costo Unitario</p>
            <p className="text-2xl font-bold text-green-900">
              ${ingrediente.costoUnitario.toFixed(2)}
            </p>
          </div>

          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <p className="text-sm font-semibold text-orange-700 mb-2">Unidad de Medida</p>
            <p className="text-2xl font-bold text-orange-900">{ingrediente.unidadMedida}</p>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <p className="text-sm font-semibold text-purple-700 mb-2">En Recetas</p>
            <p className="text-2xl font-bold text-purple-900">
              {ingrediente.recetas?.length || 0}
            </p>
          </div>
        </div>

        {/* Información de auditoría */}
        <div className="border-t pt-6 mb-6 text-sm text-gray-600">
          <p>Creado: {new Date(ingrediente.createdAt).toLocaleDateString()}</p>
          <p>Última actualización: {new Date(ingrediente.updatedAt).toLocaleDateString()}</p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4">
          <Link
            to={`/admin/ingredientes/${ingrediente.id}/editar`}
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
