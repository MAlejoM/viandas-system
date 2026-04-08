export default function Home() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Bienvenido al Sistema de Viandas
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Sistema de gestión de recetas e ingredientes
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🍳</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recetas</h2>
          <p className="text-gray-600">
            Gestiona todas tus recetas, ingredientes y detalles nutricionales
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🥕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ingredientes</h2>
          <p className="text-gray-600">
            Administra tu inventario de ingredientes y categorías
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Menús</h2>
          <p className="text-gray-600">
            Crea y publica menús semanales para tus clientes
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedidos</h2>
          <p className="text-gray-600">
            Visualiza y gestiona los pedidos de tus clientes
          </p>
        </div>
      </div>
    </div>
  );
}
