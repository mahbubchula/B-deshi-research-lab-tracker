import useAuthStore from '../store/authStore';
import { User, Mail, Briefcase } from 'lucide-react';

export default function Profile() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-dark-900">Profile Settings</h1>
      
      <div className="card p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-dark-900">{user?.name}</h2>
            <p className="text-dark-600 capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-dark-50 rounded-lg">
            <Mail className="w-5 h-5 text-dark-500" />
            <div>
              <p className="text-sm text-dark-600">Email</p>
              <p className="font-medium text-dark-900">{user?.email}</p>
            </div>
          </div>
          
          {user?.department && (
            <div className="flex items-center gap-3 p-4 bg-dark-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-dark-500" />
              <div>
                <p className="text-sm text-dark-600">Department</p>
                <p className="font-medium text-dark-900">{user.department}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
