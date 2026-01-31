import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import CollaborativeDashboard from './pages/CollaborativeDashboard';
import Goals from './pages/Goals';
import Papers from './pages/Papers';
import Tasks from './pages/Tasks';
import Profile from './pages/Profile';

// Supervisor Pages
import SupervisorDashboard from './pages/SupervisorDashboard';
import SupervisorStudents from './pages/SupervisorStudents';
import StudentDetail from './pages/StudentDetail';
import PersonalTodos from './pages/PersonalTodos';

// Layout
import Layout from './components/Layout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Supervisor Route Component (Professor or Admin only)
const SupervisorRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'professor' && user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            padding: '1rem',
          },
        }}
      />
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<CollaborativeDashboard />} />
          <Route path="goals" element={<Goals />} />
          <Route path="papers" element={<Papers />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="profile" element={<Profile />} />

          {/* Supervisor Routes */}
          <Route path="supervisor/dashboard" element={
            <SupervisorRoute>
              <SupervisorDashboard />
            </SupervisorRoute>
          } />
          <Route path="supervisor/students" element={
            <SupervisorRoute>
              <SupervisorStudents />
            </SupervisorRoute>
          } />
          <Route path="supervisor/students/:id" element={
            <SupervisorRoute>
              <StudentDetail />
            </SupervisorRoute>
          } />
          <Route path="supervisor/todos" element={
            <SupervisorRoute>
              <PersonalTodos />
            </SupervisorRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
