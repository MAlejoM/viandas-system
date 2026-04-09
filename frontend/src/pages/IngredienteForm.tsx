import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { IIngrediente, CategoriaIngrediente } from '../types';
import { ingredienteService } from '../services/ingredienteService';

export default function IngredienteForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nombre: '',
    unidadMedida: '',
    costoUnitario: '',
    categoria: 'OTRO' as CategoriaIngrediente,
  });

  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar ingrediente si es edición
  useEffect(() => {
    if (isEdit && id) {
      cargarIngrediente(parseInt(id));
    }
  }, [id, isEdit]);

  const cargarIngrediente = async (ingredienteId: number) => {
    try {
      setLoading(true);
      setError(null);
      const ingrediente = await ingredienteService.obtenerPorId(ingredienteId);
      setFormData({
        nombre: ingrediente.nombre,
        unidadMedida: ingrediente.unidadMedida,
        costoUnitario: ingrediente.costoUnitario.toString(),
        categoria: ingrediente.categoria,
      });
    } catch (err) {
      setError('Error al cargar el ingrediente');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre del ingrediente es requerido');
      return;
    }

    if (!formData.unidadMedida.trim()) {
      setError('La unidad de medida es requerida');
      return;
    }

    if (!formData.costoUnitario || parseFloat(formData.costoUnitario) < 0) {
      setError('El costo unitario debe ser un número válido y positivo');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const ingredienteData = {
        nombre: formData.nombre,
        unidadMedida: formData.unidadMedida,
        costoUnitario: parseFloat(formData.costoUnitario),
        categoria: formData.categoria,
      };

      if (isEdit && id) {
        await ingredienteService.actualizar(parseInt(id), ingredienteData);
      } else {
        await ingredienteService.crear(ingredienteData);
      }

      navigate('/admin/ingredientes');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      const fullError = JSON.stringify(err, null, 2);
      
      console.error('❌ ERROR AL GUARDAR INGREDIENTE:');
      console.error('Mensaje:', errorMessage);
      console.error('Detalles completos:', fullError);
      
      setError(isEdit ? 'Error al actualizar ingrediente' : 'Error al crear ingrediente');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Cargando ingrediente...</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <Link
          to="/admin/ingredientes"
          className="text-blue-600 hover:text-blue-800 font-bold"
        >
          ← Volver a Ingredientes
        </Link>
      </div>

      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-bold text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Pechuga de Pollo"
              required
            />
          </div>

          {/* Unidad de Medida */}
          <div>
            <label htmlFor="unidadMedida" className="block text-sm font-bold text-gray-700 mb-2">
              Unidad de Medida *
            </label>
            <input
              id="unidadMedida"
              type="text"
              name="unidadMedida"
              value={formData.unidadMedida}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: kg, g, l, ml, taza"
              required
            />
          </div>

          {/* Costo Unitario */}
          <div>
            <label htmlFor="costoUnitario" className="block text-sm font-bold text-gray-700 mb-2">
              Costo Unitario *
            </label>
            <div className="flex items-center">
              <span className="text-gray-700 mr-2">$</span>
              <input
                id="costoUnitario"
                type="number"
                name="costoUnitario"
                value={formData.costoUnitario}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 150.50"
                required
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="categoria" className="block text-sm font-bold text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="PROTEINA">Proteína</option>
              <option value="VEGETAL">Vegetal</option>
              <option value="CEREAL">Cereal</option>
              <option value="LACTEO">Lácteo</option>
              <option value="CONDIMENTO">Condimento</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          {/* Botones */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              {saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/ingredientes')}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-4 rounded transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
