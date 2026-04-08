import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AdminRecetas from './pages/AdminRecetas';
import AdminIngredientes from './pages/AdminIngredientes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/admin/recetas"
          element={
            <Layout>
              <AdminRecetas />
            </Layout>
          }
        />
        <Route
          path="/admin/ingredientes"
          element={
            <Layout>
              <AdminIngredientes />
            </Layout>
          }
        />
        {/* Rutas futuras */}
        <Route
          path="/admin/recetas/nueva"
          element={
            <Layout>
              <div className="bg-white p-8 rounded-lg shadow">
                <h1 className="text-3xl font-bold mb-4">Nueva Receta</h1>
                <p className="text-gray-600">Formulario para crear receta (próximamente)</p>
              </div>
            </Layout>
          }
        />
        <Route
          path="/admin/ingredientes/nuevo"
          element={
            <Layout>
              <div className="bg-white p-8 rounded-lg shadow">
                <h1 className="text-3xl font-bold mb-4">Nuevo Ingrediente</h1>
                <p className="text-gray-600">Formulario para crear ingrediente (próximamente)</p>
              </div>
            </Layout>
          }
        />
        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;