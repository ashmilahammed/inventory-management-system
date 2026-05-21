import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import { PageRoutes } from './constants/routes';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to={PageRoutes.LOGIN} />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Navigate to={PageRoutes.DASHBOARD} replace /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path={PageRoutes.LOGIN} element={<PublicRoute><Login /></PublicRoute>} />

        <Route path={PageRoutes.DASHBOARD} element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path={PageRoutes.INVENTORY.substring(1)} element={<Inventory />} />
          <Route path={PageRoutes.CUSTOMERS.substring(1)} element={<Customers />} />
          <Route path={PageRoutes.SALES.substring(1)} element={<Sales />} />
          <Route path={PageRoutes.REPORTS.substring(1)} element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
