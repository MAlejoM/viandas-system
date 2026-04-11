import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { IMenuSemanal, DiaSemana } from '../types';
import { menuService } from '../services/menuService';

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
  new Date(fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const toInputDate = (fecha: Date | string) => {
  const d = new Date(fecha);
  return d.toISOString().split('T')[0];
};

// ─── Badge de Estado ──────────────────────────────────────────────────────────

function BadgeEstado({ estado }: { estado: IMenuSemanal['estado'] }) {
  const config = {
    BORRADOR:  { label: 'Borrador',  cls: 'bg-amber-100 text-amber-800 border-amber-200' },
    PUBLICADO: { label: 'Publicado', cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    CERRADO:   { label: 'Cerrado',   cls: 'bg-red-100 text-red-800 border-red-200' },
  };
  const { label, cls } = config[estado];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {label}
    </span>
  );
}

// ─── Modal Clonar ─────────────────────────────────────────────────────────────

interface ModalClonarProps {
  menuOrigen: IMenuSemanal;
  onClose: () => void;
  onConfirm: (nuevaFecha: string) => Promise<void>;
  cargando: boolean;
}

function ModalClonar({ menuOrigen, onClose, onConfirm, cargando }: ModalClonarProps) {
  const [nuevaFecha, setNuevaFecha] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recetasPorDia = Object.fromEntries(
    DIAS.map((dia) => {
      const asig = menuOrigen.recetas?.find((r) => r.diaSemana === dia);
      return [dia, asig?.receta ?? null];
    })
  );

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-white font-bold text-lg">Clonar Menú</h2>
            <p className="text-primary-100 text-sm">
              Semana del {formatFecha(menuOrigen.fechaInicioSemana)}
            </p>
          </div>
          <button onClick={onClose} className="text-primary-200 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Vista previa del menú origen */}
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              📋 Menú que se va a copiar
            </p>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Día</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Receta</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-600">Tipo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {DIAS.map((dia) => {
                    const receta = recetasPorDia[dia];
                    return (
                      <tr key={dia} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-medium text-gray-800">{diasLabel[dia]}</td>
                        <td className="px-4 py-2.5 text-gray-700">
                          {receta ? receta.nombrePlato : <span className="text-gray-400 italic">Sin asignar</span>}
                        </td>
                        <td className="px-4 py-2.5">
                          {receta && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              receta.tipo === 'CARNIVORO'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {receta.tipo === 'CARNIVORO' ? '🥩 Carnívoro' : '🥦 Vegetariano'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selector de nueva fecha */}
          <div>
            <label htmlFor="nuevaFecha" className="label">
              📅 Fecha de inicio de la nueva semana *
            </label>
            <input
              id="nuevaFecha"
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              className="input-field"
            />
            {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
            <p className="mt-1 text-xs text-gray-500">
              El nuevo menú se creará en estado Borrador. Podrás ajustar recetas y la fecha de cierre antes de publicar.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={cargando}
            className="btn btn-secondary"
          >
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

export default function AdminMenus() {
  const [menus, setMenus] = useState<IMenuSemanal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalClonar, setModalClonar] = useState<{ abierto: boolean; menu: IMenuSemanal | null }>({
    abierto: false,
    menu: null,
  });
  const [clonando, setClonando] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    cargarMenus();
  }, [location.pathname]);

  const cargarMenus = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await menuService.obtenerTodos();
      setMenus(data);
    } catch (err) {
      setError('Error al cargar los menús');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublicar = async (id: number) => {
    if (!window.confirm('¿Publicar este menú? Una vez publicado no podrá editarse.')) return;
    try {
      const actualizado = await menuService.publicar(id);
      setMenus((prev) => prev.map((m) => (m.id === id ? actualizado : m)));
      setSuccess('Menú publicado correctamente ✅');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError('Error al publicar el menú');
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Eliminar este menú permanentemente? Esta acción no se puede deshacer.')) return;
    try {
      await menuService.eliminar(id);
      setMenus((prev) => prev.filter((m) => m.id !== id));
      setSuccess('Menú eliminado');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error al eliminar el menú');
    }
  };

  const handleAbrirClonar = (menu: IMenuSemanal) => {
    setModalClonar({ abierto: true, menu });
  };

  const handleClonarConfirmar = async (nuevaFecha: string) => {
    if (!modalClonar.menu) return;
    try {
      setClonando(true);
      const nuevoMenu = await menuService.clonar(modalClonar.menu.id, nuevaFecha);
      setModalClonar({ abierto: false, menu: null });
      setSuccess('Menú clonado correctamente. Ajustá los detalles antes de publicar.');
      setTimeout(() => setSuccess(null), 5000);
      navigate(`/admin/menus/${nuevoMenu.id}/editar`);
    } catch (err: any) {
      const mensaje = err?.response?.data?.error ?? 'Error al clonar el menú';
      setError(mensaje);
      setClonando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Cargando menús...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestión de Menús</h1>
          <p className="text-gray-500 mt-1">Planificá las viandas semanales y gestioná su ciclo de vida</p>
        </div>
        <Link
          to="/admin/menus/nuevo"
          className="btn btn-primary whitespace-nowrap"
          id="btn-nuevo-menu"
        >
          + Nuevo Menú
        </Link>
      </div>

      {/* Alertas */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm flex justify-between items-center">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 font-bold">✕</button>
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
          {success}
        </div>
      )}

      {/* Estado vacío */}
      {menus.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No hay menús creados aún</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Creá el primer menú semanal para empezar a asignar recetas a cada día.
          </p>
          <Link to="/admin/menus/nuevo" className="btn btn-primary">
            Crear primer menú
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Semana</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Cierre de pedidos</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Estado</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-600">Precio base</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-600">Envío</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-600">Recetas</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {menus.map((menu) => (
                <tr key={menu.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">
                      Sem. del {formatFecha(menu.fechaInicioSemana)}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatFecha(menu.fechaCierrePedidos)}
                  </td>
                  <td className="px-6 py-4">
                    <BadgeEstado estado={menu.estado} />
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700 font-medium">
                    ${Number(menu.precioBase).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    ${Number(menu.costoEnvio).toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-semibold text-gray-800">
                      {menu.recetas?.length ?? 0}
                    </span>
                    <span className="text-gray-400"> / 7</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2 flex-wrap">
                      <Link
                        to={`/admin/menus/${menu.id}`}
                        className="btn btn-secondary text-xs py-1 px-3"
                        id={`btn-ver-menu-${menu.id}`}
                      >
                        Ver
                      </Link>
                      {menu.estado === 'BORRADOR' && (
                        <>
                          <Link
                            to={`/admin/menus/${menu.id}/editar`}
                            className="btn text-xs py-1 px-3 bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400"
                            id={`btn-editar-menu-${menu.id}`}
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handlePublicar(menu.id)}
                            className="btn text-xs py-1 px-3 bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-400"
                            id={`btn-publicar-menu-${menu.id}`}
                          >
                            Publicar
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleAbrirClonar(menu)}
                        className="btn btn-secondary text-xs py-1 px-3"
                        id={`btn-clonar-menu-${menu.id}`}
                        title="Clonar hacia nueva semana"
                      >
                        🔁 Clonar
                      </button>
                      {menu.estado === 'BORRADOR' && (
                        <button
                          onClick={() => handleEliminar(menu.id)}
                          className="btn btn-danger text-xs py-1 px-3"
                          id={`btn-eliminar-menu-${menu.id}`}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Clonar */}
      {modalClonar.abierto && modalClonar.menu && (
        <ModalClonar
          menuOrigen={modalClonar.menu}
          onClose={() => setModalClonar({ abierto: false, menu: null })}
          onConfirm={handleClonarConfirmar}
          cargando={clonando}
        />
      )}
    </div>
  );
}
