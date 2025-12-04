import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Movimientos from './pages/Movimientos';
import Estadisticas from './pages/Estadisticas';
import Configuracion from './pages/Configuracion';

import { FinanzasProvider } from './context/FinanzasContext';

function App() {
  return (
    <FinanzasProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="movimientos" element={<Movimientos />} />
            <Route path="estadisticas" element={<Estadisticas />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </FinanzasProvider>
  );
}

export default App;
