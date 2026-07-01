import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import AddApplication from './pages/AddApplication';
import EditApplication from './pages/EditApplication';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          <Route 
            path="/applications" 
            element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            } />
          <Route 
            path="/applications/new" 
            element={
              <ProtectedRoute>
                <AddApplication />
              </ProtectedRoute>
            } />
          <Route 
            path="/applications/:id/edit" 
            element={
              <ProtectedRoute>
                <EditApplication />
              </ProtectedRoute>
            } />
        </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
