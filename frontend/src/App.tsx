import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import AdminRecetas from './pages/AdminRecetas';
import AdminIngredientes from './pages/AdminIngredientes';
import RecetaForm from './pages/RecetaForm';
import IngredienteForm from './pages/IngredienteForm';
import RecetaDetail from './pages/RecetaDetail';
import IngredienteDetail from './pages/IngredienteDetail';

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

        {/* Recetas - Crear y Editar (antes de dinámicas /:id) */}
        <Route
          path="/admin/recetas/nueva"
          element={
            <Layout>
              <RecetaForm />
            </Layout>
          }
        />
        <Route
          path="/admin/recetas/:id/editar"
          element={
            <Layout>
              <RecetaForm />
            </Layout>
          }
        />
        <Route
          path="/admin/recetas/:id"
          element={
            <Layout>
              <RecetaDetail />
            </Layout>
          }
        />

        {/* Ingredientes - Crear y Editar (antes de dinámicas /:id) */}
        <Route
          path="/admin/ingredientes/nuevo"
          element={
            <Layout>
              <IngredienteForm />
            </Layout>
          }
        />
        <Route
          path="/admin/ingredientes/:id/editar"
          element={
            <Layout>
              <IngredienteForm />
            </Layout>
          }
        />
        <Route
          path="/admin/ingredientes/:id"
          element={
            <Layout>
              <IngredienteDetail />
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