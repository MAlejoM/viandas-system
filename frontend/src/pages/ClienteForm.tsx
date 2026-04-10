import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { ICliente, Zona, TipoEntrega, EstadoCliente } from '../types';
import { clienteService } from '../services/clienteService';

export default function ClienteForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    zona: 'SAN_LORENZO' as Zona,
    restriccionesMedicas: '',
    preferenciaEntrega: 'DOMICILIO' as TipoEntrega,
    estado: 'ACTIVO' as EstadoCliente,
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      void cargarCliente(parseInt(id));
    }
  }, [id, isEdit]);

  const cargarCliente = async (clienteId: number) => {
    try {
      setLoading(true);
      setError(null);
      const cliente = await clienteService.obtenerPorId(clienteId);
      setFormData({
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        email: cliente.email || '',
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        zona: cliente.zona,
        restriccionesMedicas: cliente.restriccionesMedicas || '',
        preferenciaEntrega: cliente.preferenciaEntrega,
        estado: cliente.estado,
      });
    } catch (err) {
      setError('Error al cargar la información del cliente');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.apellido.trim()) {
      setError('Nombre y Apellido son requeridos');
      return;
    }
    if (!formData.telefono.trim()) {
      setError('El teléfono es obligatorio');
      return;
    }
    if (!formData.direccion.trim()) {
      setError('La dirección es obligatoria');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const clienteData = {
        ...formData,
        email: formData.email.trim() || undefined,
        restriccionesMedicas: formData.restriccionesMedicas.trim() || undefined,
      };

      if (isEdit && id) {
        await clienteService.actualizar(parseInt(id), clienteData);
      } else {
        await clienteService.crear(clienteData);
      }

      navigate('/admin/clientes');
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Error al guardar el cliente.';
      setError(errorMsg);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Cargando datos del cliente...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/admin/clientes" className="text-blue-600 hover:text-blue-800 font-bold">
          ← Volver a Clientes
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
              Nombre *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
              Apellido *
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">
              Teléfono *
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Dirección */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="direccion">
              Dirección *
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Zona */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zona">
              Zona *
            </label>
            <select
              id="zona"
              name="zona"
              value={formData.zona}
              onChange={handleInputChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="SAN_LORENZO">San Lorenzo</option>
              <option value="IRIONDO">Iriondo</option>
            </select>
          </div>

          {/* Preferencia de Entrega */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="preferenciaEntrega">
              Preferencia de Entrega *
            </label>
            <select
              id="preferenciaEntrega"
              name="preferenciaEntrega"
              value={formData.preferenciaEntrega}
              onChange={handleInputChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DOMICILIO">A Domicilio</option>
              <option value="RETIRO">Retiro en Local</option>
            </select>
          </div>

          {/* Estado (solo en edición) */}
          {isEdit && (
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado">
                Estado *
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
              </select>
            </div>
          )}

          {/* Restricciones Médicas */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="restriccionesMedicas">
              Restricciones Médicas / Notas
            </label>
            <textarea
              id="restriccionesMedicas"
              name="restriccionesMedicas"
              value={formData.restriccionesMedicas}
              onChange={handleInputChange}
              rows={3}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Celíaco, Hipertenso, Alergia a frutos secos..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end mt-8 gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/clientes')}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className={`${
              saving ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-bold py-2 px-10 rounded transition-colors`}
          >
            {saving ? 'Guardando...' : isEdit ? 'Actualizar Cliente' : 'Crear Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
}
