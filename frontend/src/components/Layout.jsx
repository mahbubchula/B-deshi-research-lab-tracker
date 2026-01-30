import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Target, FileText, CheckSquare, User, LogOut, FlaskConical, Bell } from 'lucide-react';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Goals', to: '/goals', icon: Target },
    { name: 'Papers', to: '/papers', icon: FileText },
    { name: 'Tasks', to: '/tasks', icon: CheckSquare },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-dark-50 via-white to-primary-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-dark-200 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-dark-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-dark-900">Lab Tracker</h1>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-dark-600 hover:bg-dark-50 hover:text-dark-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-dark-200">
          <NavLink
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-dark-50 transition-all mb-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark-900 truncate">{user?.name}</p>
              <p className="text-xs text-dark-500 capitalize">{user?.role}</p>
            </div>
          </NavLink>
          
          <button
            onClick={handleLogout}
            className="w-full btn btn-ghost text-red-600 hover:bg-red-50 justify-start"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-dark-200 px-6 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-semibold text-dark-900">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-sm text-dark-600">{user?.email}</p>
          </div>
          <button className="btn btn-ghost relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
