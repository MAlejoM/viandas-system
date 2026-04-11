import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { IMenuSemanal, DiaSemana } from '../types';
import { menuService } from '../services/menuService';

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

const formatFecha = (fecha: Date | string) =>
  new Date(fecha).toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ─── Badge de Estado ──────────────────────────────────────────────────────────

function BadgeEstado({ estado }: { estado: IMenuSemanal['estado'] }) {
  const config = {
    BORRADOR:  { label: '🟡 Borrador',  cls: 'bg-amber-100 text-amber-800 border-amber-200' },
    PUBLICADO: { label: '🟢 Publicado', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    CERRADO:   { label: '🔴 Cerrado',   cls: 'bg-red-100 text-red-800 border-red-200' },
  };
  const { label, cls } = config[estado];
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${cls}`}>
      {label}
    </span>
  );
}

// ─── Modal Clonar (inline) ────────────────────────────────────────────────────

interface ModalClonarProps {
  menuOrigen: IMenuSemanal;
  onClose: () => void;
  onConfirm: (nuevaFecha: string) => Promise<void>;
  cargando: boolean;
}

function ModalClonar({ menuOrigen, onClose, onConfirm, cargando }: ModalClonarProps) {
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!nuevaFecha) {
      setError('Seleccioná la fecha de inicio de la nueva semana');
      return;
    }
    setError(null);
    await onConfirm(nuevaFecha);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-primary-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg">Clonar Menú</h2>
          <button onClick={onClose} className="text-primary-200 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Se crearán las mismas asignaciones de recetas para la nueva semana.
            El menú nuevo quedará en estado <strong>Borrador</strong> para que puedas ajustarlo antes de publicar.
          </p>
          <div>
            <label htmlFor="nuevaFechaClonar" className="label">
              Fecha de inicio de la nueva semana *
            </label>
            <input
              id="nuevaFechaClonar"
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              className="input-field"
            />
            {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t">
          <button type="button" onClick={onClose} disabled={cargando} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={cargando || !nuevaFecha}
            className="btn btn-primary"
          >
            {cargando ? 'Clonando...' : '✅ Confirmar Clon'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function MenuDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [menu, setMenu] = useState<IMenuSemanal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publicando, setPublicando] = useState(false);
  const [modalClonar, setModalClonar] = useState(false);
  const [clonando, setClonando] = useState(false);

  useEffect(() => {
    if (id) cargarMenu(parseInt(id));
  }, [id]);

  const cargarMenu = async (menuId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuService.obtenerPorId(menuId);
      setMenu(data);
    } catch (err) {
      setError('Error al cargar el menú');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublicar = async () => {
    if (!menu) return;
    if (!window.confirm('¿Publicar este menú? Una vez publicado no podrá editarse.')) return;
    try {
      setPublicando(true);
      const actualizado = await menuService.publicar(menu.id);
      setMenu(actualizado);
    } catch (err) {
      setError('Error al publicar el menú');
    } finally {
      setPublicando(false);
    }
  };

  const handleClonarConfirmar = async (nuevaFecha: string) => {
    if (!menu) return;
    try {
      setClonando(true);
      const nuevoMenu = await menuService.clonar(menu.id, nuevaFecha);
      setModalClonar(false);
      navigate(`/admin/menus/${nuevoMenu.id}/editar`);
    } catch (err: any) {
      const mensaje = err?.response?.data?.error ?? 'Error al clonar el menú';
      setError(mensaje);
      setClonando(false);
    }
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Cargando menú...</p>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <p className="text-gray-500 mb-4">Menú no encontrado</p>
        <Link to="/admin/menus" className="btn btn-secondary">← Volver al listado</Link>
      </div>
    );
  }

  // ── Construir planilla por día ──────────────────────────────────────────────
  const recetasPorDia = Object.fromEntries(
    DIAS.map((dia) => {
      const asig = (menu.recetas ?? []).find((r) => r.diaSemana === dia);
      return [dia, asig?.receta ?? null];
    })
  );

  const totalAsignados = DIAS.filter((d) => recetasPorDia[d] !== null).length;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/admin/menus" className="text-primary-600 hover:text-primary-800 font-medium text-sm">
          ← Volver a Menús
        </Link>
      </div>

      {/* Alertas */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex justify-between items-center">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 font-bold">✕</button>
        </div>
      )}

      {/* ── Header del menú ─────────────────────────────────────────────────── */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-extrabold text-gray-900">
                Menú Semanal
              </h1>
              <BadgeEstado estado={menu.estado} />
            </div>
            <p className="text-gray-600">
              <span className="font-semibold">Semana del</span>{' '}
              {capitalize(formatFecha(menu.fechaInicioSemana))}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              <span className="font-semibold">Cierre:</span>{' '}
              {capitalize(formatFecha(menu.fechaCierrePedidos))}
            </p>
            {menu.fechaPublicacion && (
              <p className="text-xs text-emerald-600 mt-1">
                ✅ Publicado el {capitalize(formatFecha(menu.fechaPublicacion))}
              </p>
            )}
          </div>

          {/* Acciones */}
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {menu.estado === 'BORRADOR' && (
              <>
                <Link
                  to={`/admin/menus/${menu.id}/editar`}
                  id="btn-editar-menu-detail"
                  className="btn bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400"
                >
                  ✏️ Editar
                </Link>
                <button
                  onClick={handlePublicar}
                  disabled={publicando}
                  id="btn-publicar-menu-detail"
                  className="btn bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-400"
                >
                  {publicando ? 'Publicando...' : '🚀 Publicar Menú'}
                </button>
              </>
            )}
            <button
              onClick={() => setModalClonar(true)}
              id="btn-clonar-menu-detail"
              className="btn btn-secondary"
            >
              🔁 Clonar Semana
            </button>
          </div>
        </div>

        {/* Resumen de precios */}
        <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Precio base</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              ${Number(menu.precioBase).toLocaleString('es-AR')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Costo de envío</p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              ${Number(menu.costoEnvio).toLocaleString('es-AR')}
            </p>
          </div>
          <div className="text-center col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Recetas asignadas</p>
            <p className={`text-xl font-bold mt-1 ${totalAsignados === 7 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {totalAsignados} / 7
            </p>
          </div>
        </div>
      </div>

      {/* ── Planilla semanal ────────────────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Planilla semanal</h2>
          <p className="text-sm text-gray-500">Recetas asignadas para cada día</p>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-600 w-32">Día</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Receta</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-600">Tipo</th>
              <th className="px-6 py-3 text-right font-semibold text-gray-600">Calorías</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {DIAS.map((dia) => {
              const receta = recetasPorDia[dia];
              return (
                <tr
                  key={dia}
                  className={`hover:bg-gray-50 transition-colors ${!receta ? 'opacity-60' : ''}`}
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">{diasLabel[dia]}</td>
                  <td className="px-6 py-4">
                    {receta ? (
                      <div>
                        <p className="font-medium text-gray-900">{receta.nombrePlato}</p>
                        {receta.descripcion && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{receta.descripcion}</p>
                        )}
                      </div>
                    ) : (
                      <span className="italic text-gray-400">Sin receta asignada</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {receta && (
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        receta.tipo === 'CARNIVORO'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {receta.tipo === 'CARNIVORO' ? '🥩 Carnívoro' : '🥦 Vegetariano'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    {receta?.calorias ? `${receta.calorias} kcal` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {totalAsignados < 7 && (
          <div className="px-6 py-4 bg-amber-50 border-t border-amber-100">
            <p className="text-sm text-amber-700">
              ⚠️ <strong>{7 - totalAsignados} días</strong> sin receta asignada.
              {menu.estado === 'BORRADOR' && (
                <>
                  {' '}
                  <Link to={`/admin/menus/${menu.id}/editar`} className="font-bold underline">
                    Editá el menú
                  </Link>
                  {' '}para completar la planilla antes de publicar.
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Clonar */}
      {modalClonar && (
        <ModalClonar
          menuOrigen={menu}
          onClose={() => setModalClonar(false)}
          onConfirm={handleClonarConfirmar}
          cargando={clonando}
        />
      )}
    </div>
  );
}
