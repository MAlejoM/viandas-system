import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Páginas públicas
import Login from './pages/Login';

// Páginas protegidas
import Home from './pages/Home';
import AdminRecetas from './pages/AdminRecetas';
import AdminIngredientes from './pages/AdminIngredientes';
import RecetaForm from './pages/RecetaForm';
import IngredienteForm from './pages/IngredienteForm';
import RecetaDetail from './pages/RecetaDetail';
import IngredienteDetail from './pages/IngredienteDetail';
import AdminClientes from './pages/AdminClientes';
import ClienteForm from './pages/ClienteForm';
import ClienteDetail from './pages/ClienteDetail';
import AdminMenus from './pages/AdminMenus';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ============================
              RUTA PÚBLICA: Login
          ============================ */}
          <Route path="/login" element={<Login />} />

          {/* ============================
              RUTAS PROTEGIDAS
              Todas pasan por ProtectedRoute
          ============================ */}

          {/* Inicio */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout><Home /></Layout>
            </ProtectedRoute>
          } />

          {/* Clientes */}
          <Route path="/admin/clientes" element={
            <ProtectedRoute>
              <Layout><AdminClientes /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/clientes/nuevo" element={
            <ProtectedRoute>
              <Layout><ClienteForm /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/clientes/:id/editar" element={
            <ProtectedRoute>
              <Layout><ClienteForm /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/clientes/:id" element={
            <ProtectedRoute>
              <Layout><ClienteDetail /></Layout>
            </ProtectedRoute>
          } />

          {/* Recetas — /nueva antes de /:id para que no haya conflicto */}
          <Route path="/admin/recetas" element={
            <ProtectedRoute>
              <Layout><AdminRecetas /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/recetas/nueva" element={
            <ProtectedRoute>
              <Layout><RecetaForm /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/recetas/:id/editar" element={
            <ProtectedRoute>
              <Layout><RecetaForm /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/recetas/:id" element={
            <ProtectedRoute>
              <Layout><RecetaDetail /></Layout>
            </ProtectedRoute>
          } />

          {/* Ingredientes */}
          <Route path="/admin/ingredientes" element={
            <ProtectedRoute>
              <Layout><AdminIngredientes /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/ingredientes/nuevo" element={
            <ProtectedRoute>
              <Layout><IngredienteForm /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/ingredientes/:id/editar" element={
            <ProtectedRoute>
              <Layout><IngredienteForm /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/ingredientes/:id" element={
            <ProtectedRoute>
              <Layout><IngredienteDetail /></Layout>
            </ProtectedRoute>
          } />

          {/* Menus */}
          <Route path="/admin/menus" element={
            <ProtectedRoute>
              <Layout><AdminMenus /></Layout>
            </ProtectedRoute>
          } />

          {/* 404 → redirige a home (que a su vez redirige a /login si no hay auth) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;