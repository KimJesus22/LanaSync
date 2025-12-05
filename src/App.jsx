import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { FinanzasProvider } from './context/FinanzasContext';
import Login from './pages/Login';
import { useFinanzas } from './context/FinanzasContext';
import { Navigate } from 'react-router-dom';
import OnboardingGroup from './components/OnboardingGroup';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy Load Pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Movimientos = React.lazy(() => import('./pages/Movimientos'));
const Estadisticas = React.lazy(() => import('./pages/Estadisticas'));
const Configuracion = React.lazy(() => import('./pages/Configuracion'));

const ProtectedRoute = ({ children }) => {
  const { session, loading, userGroup, loadingGroup, setUserGroup } = useFinanzas();

  if (loading || loadingGroup) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Cargando...</div>;

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (!userGroup) {
    return <OnboardingGroup userId={session.user.id} onGroupJoined={setUserGroup} />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={
          <Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </Suspense>
        } />
        <Route path="movimientos" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Movimientos />
          </Suspense>
        } />
        <Route path="estadisticas" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Estadisticas />
          </Suspense>
        } />
        <Route path="configuracion" element={
          <Suspense fallback={<LoadingSpinner />}>
            <Configuracion />
          </Suspense>
        } />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <FinanzasProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </FinanzasProvider>
  );
}

export default App;
