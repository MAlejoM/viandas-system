import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { IMenuSemanal, IReceta, DiaSemana, FormMenu } from '../types';
import { menuService } from '../services/menuService';
import { recetaService } from '../services/recetaService';

// ─── Constantes ───────────────────────────────────────────────────────────────

const DIAS: DiaSemana[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

const diasLabel: Record<DiaSemana, string> = {
  LUNES: 'Lunes',
  MARTES: 'Martes',
  MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves',
  VIERNES: 'Viernes',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo',
};

// Mapa de dia → recetaId seleccionada ('' = sin asignar)
type PlanillaDias = Record<DiaSemana, string>;

const planillaVacia = (): PlanillaDias =>
  Object.fromEntries(DIAS.map((d) => [d, ''])) as PlanillaDias;

const toInputDate = (fecha: Date | string): string => {
  const d = new Date(fecha);
  return d.toISOString().split('T')[0];
};

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function MenuForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  // ── Estado del formulario base ──────────────────────────────────────────────
  const [formData, setFormData] = useState<FormMenu>({
    fechaInicioSemana: '',
    fechaCierrePedidos: '',
    precioBase: '',
    costoEnvio: '',
  });

  // ── Estado de la planilla semanal ───────────────────────────────────────────
  const [planilla, setPlanilla] = useState<PlanillaDias>(planillaVacia());

  // ── Datos de referencia ─────────────────────────────────────────────────────
  const [recetasDisponibles, setRecetasDisponibles] = useState<IReceta[]>([]);
  const [menuOriginal, setMenuOriginal] = useState<IMenuSemanal | null>(null);

  // ── UI State ────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Cargar datos iniciales ──────────────────────────────────────────────────
  useEffect(() => {
    cargarRecetasDisponibles();
    if (isEdit && id) {
      cargarMenu(parseInt(id));
    }
  }, [id, isEdit]);

  const cargarRecetasDisponibles = async () => {
    try {
      const data = await recetaService.obtenerTodas();
      setRecetasDisponibles(data);
    } catch (err) {
      console.error('Error al cargar recetas disponibles:', err);
    }
  };

  const cargarMenu = async (menuId: number) => {
    try {
      setLoading(true);
      setError(null);
      const menu = await menuService.obtenerPorId(menuId);
      setMenuOriginal(menu);

      // Rellenar datos base
      setFormData({
        fechaInicioSemana: toInputDate(menu.fechaInicioSemana),
        fechaCierrePedidos: toInputDate(menu.fechaCierrePedidos),
        precioBase: menu.precioBase,
        costoEnvio: menu.costoEnvio,
      });

      // Rellenar planilla con recetas existentes
      const nuevaPlanilla = planillaVacia();
      for (const asig of menu.recetas ?? []) {
        nuevaPlanilla[asig.diaSemana] = String(asig.recetaId);
      }
      setPlanilla(nuevaPlanilla);
    } catch (err) {
      setError('Error al cargar el menú');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── Handlers de formulario ──────────────────────────────────────────────────
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handlePlanillaChange = (dia: DiaSemana, recetaId: string) => {
    setPlanilla((prev) => ({ ...prev, [dia]: recetaId }));
  };

  // ── Validaciones client-side ────────────────────────────────────────────────
  const validar = (): string | null => {
    if (!formData.fechaInicioSemana) return 'La fecha de inicio de la semana es requerida';
    if (!formData.fechaCierrePedidos) return 'La fecha de cierre de pedidos es requerida';

    const inicio = new Date(formData.fechaInicioSemana);
    const cierre = new Date(formData.fechaCierrePedidos);

    if (cierre >= inicio) {
      return 'La fecha de cierre de pedidos debe ser anterior a la fecha de inicio de la semana';
    }

    if (!formData.precioBase || Number(formData.precioBase) <= 0) {
      return 'El precio base debe ser un número positivo';
    }
    if (formData.costoEnvio === '' || Number(formData.costoEnvio) < 0) {
      return 'El costo de envío debe ser un número mayor o igual a 0';
    }

    return null;
  };

  // ── Submit principal ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorValidacion = validar();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      setSaving(true);
      setError(null);

      let menuId: number;

      if (isEdit && id) {
        // Actualizar datos base del menú
        await menuService.actualizar(parseInt(id), {
          fechaInicioSemana: formData.fechaInicioSemana,
          fechaCierrePedidos: formData.fechaCierrePedidos,
          precioBase: Number(formData.precioBase),
          costoEnvio: Number(formData.costoEnvio),
        });
        menuId = parseInt(id);

        // En edición: para cada día, remover la asignación anterior y crear la nueva si hay selección
        // Obtenemos el estado actual de asignaciones del servidor
        const asignacionesActuales = menuOriginal?.recetas ?? [];

        for (const dia of DIAS) {
          const asignacionActual = asignacionesActuales.find((a) => a.diaSemana === dia);
          const nuevaRecetaId = planilla[dia];

          const recetaActualId = asignacionActual ? String(asignacionActual.recetaId) : '';

          if (recetaActualId === nuevaRecetaId) continue; // Sin cambio para este día

          // Remover la asignación anterior si existía
          if (asignacionActual) {
            await menuService.removerReceta(menuId, asignacionActual.recetaId);
          }

          // Asignar la nueva receta si se seleccionó una
          if (nuevaRecetaId) {
            await menuService.asignarReceta(menuId, parseInt(nuevaRecetaId), dia);
          }
        }
      } else {
        // Crear nuevo menú
        const nuevoMenu = await menuService.crear({
          fechaInicioSemana: formData.fechaInicioSemana,
          fechaCierrePedidos: formData.fechaCierrePedidos,
          precioBase: Number(formData.precioBase),
          costoEnvio: Number(formData.costoEnvio),
        });
        menuId = nuevoMenu.id;

        // Asignar recetas a los días seleccionados
        for (const dia of DIAS) {
          const recetaId = planilla[dia];
          if (recetaId) {
            await menuService.asignarReceta(menuId, parseInt(recetaId), dia);
          }
        }
      }

      navigate(`/admin/menus/${menuId}`);
    } catch (err: any) {
      // Manejo especial del 409 de solapamiento
      if (err?.response?.status === 409) {
        setError(err.response.data?.error ?? 'Ya existe un menú para esa semana');
      } else {
        setError(isEdit ? 'Error al actualizar el menú' : 'Error al crear el menú');
        console.error(err);
      }
    } finally {
      setSaving(false);
    }
  };

  // ── Calcular recetas asignadas para el conteo ───────────────────────────────
  const totalAsignados = DIAS.filter((d) => planilla[d] !== '').length;

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Cargando menú...</p>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/admin/menus" className="text-primary-600 hover:text-primary-800 font-medium text-sm">
          ← Volver a Menús
        </Link>
      </div>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
        {isEdit ? 'Editar Menú' : 'Nuevo Menú'}
      </h1>
      <p className="text-gray-500 mb-8">
        {isEdit
          ? 'Modificá los datos del menú y las recetas asignadas a cada día.'
          : 'Completá la información del menú y asigná una receta a cada día de la semana.'}
      </p>

      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex justify-between items-center">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 font-bold">✕</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ══ Sección 1: Datos base ══════════════════════════════════════════ */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            Datos del menú
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Fecha inicio */}
            <div>
              <label htmlFor="fechaInicioSemana" className="label">
                Inicio de semana *
              </label>
              <input
                id="fechaInicioSemana"
                name="fechaInicioSemana"
                type="date"
                value={formData.fechaInicioSemana}
                onChange={handleInputChange}
                className="input-field"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Día de entrega de la primera vianda (ej. lunes)</p>
            </div>

            {/* Fecha cierre */}
            <div>
              <label htmlFor="fechaCierrePedidos" className="label">
                Cierre de pedidos *
              </label>
              <input
                id="fechaCierrePedidos"
                name="fechaCierrePedidos"
                type="date"
                value={formData.fechaCierrePedidos}
                onChange={handleInputChange}
                className="input-field"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Debe ser anterior al inicio de semana</p>
            </div>

            {/* Precio base */}
            <div>
              <label htmlFor="precioBase" className="label">
                Precio base ($) *
              </label>
              <input
                id="precioBase"
                name="precioBase"
                type="number"
                min="0"
                step="0.01"
                value={formData.precioBase}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Ej: 5000"
                required
              />
            </div>

            {/* Costo envío */}
            <div>
              <label htmlFor="costoEnvio" className="label">
                Costo de envío ($) *
              </label>
              <input
                id="costoEnvio"
                name="costoEnvio"
                type="number"
                min="0"
                step="0.01"
                value={formData.costoEnvio}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Ej: 800"
                required
              />
            </div>
          </div>
        </div>

        {/* ══ Sección 2: Planilla Semanal ════════════════════════════════════ */}
        <div className="card p-6">
          <div className="flex justify-between items-start mb-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Planilla semanal
            </h2>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              totalAsignados === 7
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {totalAsignados} / 7 días asignados
            </span>
          </div>

          {recetasDisponibles.length === 0 && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
              ⚠️ No hay recetas disponibles. <Link to="/admin/recetas/nueva" className="font-bold underline">Creá una receta</Link> primero.
            </div>
          )}

          <div className="space-y-3">
            {DIAS.map((dia) => {
              const recetaSeleccionada = recetasDisponibles.find(
                (r) => String(r.id) === planilla[dia]
              );

              return (
                <div
                  key={dia}
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border transition-colors ${
                    planilla[dia]
                      ? 'bg-primary-50 border-primary-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {/* Etiqueta del día */}
                  <div className="w-28 shrink-0">
                    <p className="font-semibold text-gray-800">{diasLabel[dia]}</p>
                    {recetaSeleccionada && (
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                        recetaSeleccionada.tipo === 'CARNIVORO'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {recetaSeleccionada.tipo === 'CARNIVORO' ? '🥩' : '🥦'}
                        {' '}{recetaSeleccionada.tipo === 'CARNIVORO' ? 'Carnívoro' : 'Vegetariano'}
                      </span>
                    )}
                  </div>

                  {/* Selector de receta */}
                  <div className="flex-1">
                    <select
                      id={`planilla-${dia}`}
                      value={planilla[dia]}
                      onChange={(e) => handlePlanillaChange(dia, e.target.value)}
                      className="input-field"
                      aria-label={`Receta para ${diasLabel[dia]}`}
                    >
                      <option value="">— Sin receta asignada —</option>
                      {recetasDisponibles.map((receta) => (
                        <option key={receta.id} value={receta.id}>
                          {receta.tipo === 'CARNIVORO' ? '🥩' : '🥦'} {receta.nombrePlato}
                          {receta.calorias ? ` (${receta.calorias} kcal)` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>

          {totalAsignados < 7 && totalAsignados > 0 && (
            <p className="mt-3 text-xs text-amber-600 font-medium">
              ⚠️ Quedan {7 - totalAsignados} días sin receta. Podés guardarlo así y completarlo después.
            </p>
          )}
        </div>

        {/* ══ Botones ════════════════════════════════════════════════════════ */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            id="btn-guardar-menu"
            className="flex-1 btn btn-primary py-3 text-base font-semibold"
          >
            {saving
              ? 'Guardando...'
              : isEdit
              ? '💾 Actualizar Menú'
              : '💾 Guardar Borrador'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/menus')}
            disabled={saving}
            className="btn btn-secondary py-3 px-6"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
