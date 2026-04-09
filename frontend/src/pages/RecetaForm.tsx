import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { IIngrediente, IRecetaIngrediente, TipoReceta } from '../types';
import { recetaService } from '../services/recetaService';
import { ingredienteService } from '../services/ingredienteService';

// Tipo para ingredientes locales (antes de persistir en la API)
interface LocalIngrediente {
  tempId: number;        // clave única temporal para React
  ingredienteId: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  unidadMedida: string;
}

export default function RecetaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nombrePlato: '',
    descripcion: '',
    tipo: 'CARNIVORO' as TipoReceta,
    calorias: '',
    fotoUrl: '',
  });

  // Ingredientes para modo edición (vienen de la API)
  const [ingredientesEdit, setIngredientesEdit] = useState<IRecetaIngrediente[]>([]);
  // Ingredientes para modo creación (locales, se envían al hacer submit)
  const [ingredientesLocal, setIngredientesLocal] = useState<LocalIngrediente[]>([]);
  const [tempIdCounter, setTempIdCounter] = useState(0);

  const [availableIngredientes, setAvailableIngredientes] = useState<IIngrediente[]>([]);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIngrediente, setSelectedIngrediente] = useState<string>('');
  const [cantidadIngrediente, setCantidadIngrediente] = useState('');
  const [unidadIngrediente, setUnidadIngrediente] = useState('');

  useEffect(() => {
    cargarIngredientesDisponibles();
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      cargarReceta(parseInt(id));
    }
  }, [id, isEdit]);

  const cargarReceta = async (recetaId: number) => {
    try {
      setLoading(true);
      setError(null);
      const receta = await recetaService.obtenerPorId(recetaId);
      setFormData({
        nombrePlato: receta.nombrePlato,
        descripcion: receta.descripcion || '',
        tipo: receta.tipo,
        calorias: receta.calorias?.toString() || '',
        fotoUrl: receta.fotoUrl || '',
      });
      const ingredientesReceta = await recetaService.obtenerIngredientes(recetaId);
      setIngredientesEdit(ingredientesReceta);
    } catch (err) {
      setError('Error al cargar la receta');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cargarIngredientesDisponibles = async () => {
    try {
      const data = await ingredienteService.obtenerTodos();
      setAvailableIngredientes(data);
    } catch (err) {
      console.error('Error al cargar ingredientes:', err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAgregarIngrediente = async () => {
    if (!selectedIngrediente || !cantidadIngrediente || !unidadIngrediente) {
      setError('Debe completar todos los campos del ingrediente');
      return;
    }

    const cantidadNum = parseFloat(cantidadIngrediente);
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      setError('La cantidad debe ser un número positivo');
      return;
    }

    setError(null);

    try {
      if (isEdit && id) {
        // Modo edición: persistir inmediatamente en la API
        await recetaService.agregarIngrediente(parseInt(id), {
          ingredienteId: parseInt(selectedIngrediente),
          cantidad: cantidadNum,
          unidadMedida: unidadIngrediente,
        });
        const ingredientesReceta = await recetaService.obtenerIngredientes(parseInt(id));
        setIngredientesEdit(ingredientesReceta);
      } else {
        // Modo creación: agregar localmente (se enviarán al guardar)
        const ingrediente = availableIngredientes.find(
          i => i.id === parseInt(selectedIngrediente)
        );
        if (!ingrediente) return;

        const newTempId = tempIdCounter + 1;
        setTempIdCounter(newTempId);
        setIngredientesLocal(prev => [
          ...prev,
          {
            tempId: newTempId,
            ingredienteId: ingrediente.id,
            nombre: ingrediente.nombre,
            categoria: ingrediente.categoria,
            cantidad: cantidadNum,
            unidadMedida: unidadIngrediente,
          },
        ]);
      }

      setSelectedIngrediente('');
      setCantidadIngrediente('');
      setUnidadIngrediente('');
    } catch (err) {
      setError('Error al agregar ingrediente');
      console.error(err);
    }
  };

  const handleEliminarIngrediente = async (identificador: number) => {
    try {
      if (isEdit && id) {
        // Modo edición: eliminar de la API (identificador = ingredienteId del join)
        await recetaService.eliminarIngrediente(parseInt(id), identificador);
        const ingredientesReceta = await recetaService.obtenerIngredientes(parseInt(id));
        setIngredientesEdit(ingredientesReceta);
      } else {
        // Modo creación: eliminar del estado local (identificador = tempId)
        setIngredientesLocal(prev => prev.filter(ing => ing.tempId !== identificador));
      }
    } catch (err) {
      setError('Error al eliminar ingrediente');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombrePlato.trim()) {
      setError('El nombre del plato es requerido');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const recetaData = {
        nombrePlato: formData.nombrePlato,
        descripcion: formData.descripcion || undefined,
        tipo: formData.tipo,
        calorias: formData.calorias ? parseInt(formData.calorias) : undefined,
        fotoUrl: formData.fotoUrl || undefined,
      };

      if (isEdit && id) {
        await recetaService.actualizar(parseInt(id), recetaData);
      } else {
        // 1. Crear la receta
        const nuevaReceta = await recetaService.crear(recetaData);

        // 2. Persistir los ingredientes locales en la API
        for (const ing of ingredientesLocal) {
          await recetaService.agregarIngrediente(nuevaReceta.id, {
            ingredienteId: ing.ingredienteId,
            cantidad: ing.cantidad,
            unidadMedida: ing.unidadMedida,
          });
        }
      }

      navigate('/admin/recetas');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      const fullError = JSON.stringify(err, null, 2);
      
      console.error('❌ ERROR AL GUARDAR RECETA:');
      console.error('Mensaje:', errorMessage);
      console.error('Detalles completos:', fullError);
      
      setError(isEdit ? 'Error al actualizar receta' : 'Error al crear receta');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Cargando receta...</div>
      </div>
    );
  }

  // Lista unificada para renderizar (edit usa API, creación usa local)
  const ingredientesParaMostrar = isEdit
    ? ingredientesEdit.map(ing => ({
        key: `edit-${ing.id}`,
        deleteId: ing.id,
        nombre: ing.ingrediente?.nombre ?? `Ingrediente #${ing.ingredienteId}`,
        cantidad: ing.cantidad,
        unidadMedida: ing.unidadMedida,
      }))
    : ingredientesLocal.map(ing => ({
        key: `local-${ing.tempId}`,
        deleteId: ing.tempId,
        nombre: `${ing.nombre} (${ing.categoria})`,
        cantidad: ing.cantidad,
        unidadMedida: ing.unidadMedida,
      }));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link to="/admin/recetas" className="text-blue-600 hover:text-blue-800 font-bold">
          ← Volver a Recetas
        </Link>
      </div>

      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Editar Receta' : 'Nueva Receta'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre del Plato */}
          <div>
            <label htmlFor="nombrePlato" className="block text-sm font-bold text-gray-700 mb-2">
              Nombre del Plato *
            </label>
            <input
              id="nombrePlato"
              type="text"
              name="nombrePlato"
              value={formData.nombrePlato}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Pollo a la Parrilla"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-bold text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del plato"
              rows={3}
            />
          </div>

          {/* Tipo */}
          <div>
            <label htmlFor="tipo" className="block text-sm font-bold text-gray-700 mb-2">
              Tipo *
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="CARNIVORO">Carnívoro</option>
              <option value="VEGETARIANO">Vegetariano</option>
            </select>
          </div>

          {/* Calorías */}
          <div>
            <label htmlFor="calorias" className="block text-sm font-bold text-gray-700 mb-2">
              Calorías
            </label>
            <input
              id="calorias"
              type="number"
              name="calorias"
              value={formData.calorias}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 500"
            />
          </div>

          {/* Foto URL */}
          <div>
            <label htmlFor="fotoUrl" className="block text-sm font-bold text-gray-700 mb-2">
              URL de Foto
            </label>
            <input
              id="fotoUrl"
              type="url"
              name="fotoUrl"
              value={formData.fotoUrl}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://ejemplo.com/foto.jpg"
            />
          </div>

          {/* Ingredientes */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Ingredientes</h3>

            {!isEdit && (
              <p className="text-sm text-blue-600 mb-3">
                Los ingredientes se guardan junto con la receta al presionar "Crear".
              </p>
            )}

            {/* Agregar ingrediente */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
              <div>
                <label htmlFor="ingredienteSelect" className="block text-sm font-bold text-gray-700 mb-2">
                  Ingrediente
                </label>
                <select
                  id="ingredienteSelect"
                  value={selectedIngrediente}
                  onChange={e => setSelectedIngrediente(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar ingrediente...</option>
                  {availableIngredientes.map(ing => (
                    <option key={ing.id} value={ing.id}>
                      {ing.nombre} ({ing.categoria})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="cantidadIngrediente" className="block text-sm font-bold text-gray-700 mb-2">
                    Cantidad
                  </label>
                  <input
                    id="cantidadIngrediente"
                    type="number"
                    step="0.1"
                    min="0"
                    value={cantidadIngrediente}
                    onChange={e => setCantidadIngrediente(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 500"
                  />
                </div>

                <div>
                  <label htmlFor="unidadIngrediente" className="block text-sm font-bold text-gray-700 mb-2">
                    Unidad
                  </label>
                  <input
                    id="unidadIngrediente"
                    type="text"
                    value={unidadIngrediente}
                    onChange={e => setUnidadIngrediente(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: g, ml, taza"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleAgregarIngrediente}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                + Agregar Ingrediente
              </button>
            </div>

            {/* Lista de ingredientes */}
            {ingredientesParaMostrar.length > 0 && (
              <div className="space-y-2">
                {ingredientesParaMostrar.map(ing => (
                  <div
                    key={ing.key}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{ing.nombre}</p>
                      <p className="text-sm text-gray-600">
                        {ing.cantidad} {ing.unidadMedida}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleEliminarIngrediente(ing.deleteId)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              onClick={() => navigate('/admin/recetas')}
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
