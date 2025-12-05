import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Movimientos from './pages/Movimientos';
import Estadisticas from './pages/Estadisticas';
import Configuracion from './pages/Configuracion';

import { FinanzasProvider } from './context/FinanzasContext';

import Login from './pages/Login';
import { useFinanzas } from './context/FinanzasContext';
import { Navigate } from 'react-router-dom';
import OnboardingGroup from './components/OnboardingGroup';

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
        <Route index element={<Dashboard />} />
        <Route path="movimientos" element={<Movimientos />} />
        <Route path="estadisticas" element={<Estadisticas />} />
        <Route path="configuracion" element={<Configuracion />} />
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
