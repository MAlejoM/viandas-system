import { Card } from '../components/UI';

export default function AdminMenus() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestión de Menús</h1>
          <p className="text-gray-500 mt-1">Configura las viandas semanales para tus clientes</p>
        </div>
        <button className="btn btn-primary">
          + Nuevo Menú
        </button>
      </div>

      <Card className="p-12 text-center">
        <div className="text-6xl mb-6">📅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Próximamente</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Estamos trabajando en el módulo de planificación de menús. 
          Aquí podrás asignar recetas a días específicos y publicarlos.
        </p>
      </Card>
    </div>
  );
}
