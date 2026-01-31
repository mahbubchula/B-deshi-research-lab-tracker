import { useState, useEffect } from 'react';
import { Users, X } from 'lucide-react';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function UserSelector({ selectedUsers, onChange, multiple = true, label = "Assign to Students" }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getAll();
      setUsers(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserToggle = (userId) => {
    if (multiple) {
      if (selectedUsers.includes(userId)) {
        onChange(selectedUsers.filter(id => id !== userId));
      } else {
        onChange([...selectedUsers, userId]);
      }
    } else {
      onChange(selectedUsers.includes(userId) ? [] : [userId]);
    }
  };

  const getSelectedUserNames = () => {
    return users
      .filter(user => selectedUsers.includes(user._id))
      .map(user => user.name)
      .join(', ');
  };

  if (loading) {
    return (
      <div className="text-sm text-dark-500">Loading users...</div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-dark-700 mb-2">
        {label} {multiple && <span className="text-dark-500">(Select multiple)</span>}
      </label>

      {/* Selected Users Display */}
      {selectedUsers.length > 0 && (
        <div className="mb-2 p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <p className="text-sm text-dark-700">
            <span className="font-medium">Selected:</span> {getSelectedUserNames()}
          </p>
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-xs text-red-600 hover:text-red-800 mt-1 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </button>
        </div>
      )}

      {/* Search */}
      <input
        type="text"
        placeholder="Search users by name, email, or department..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input mb-2"
      />

      {/* User List */}
      <div className="border border-dark-200 rounded-lg max-h-64 overflow-y-auto">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserToggle(user._id)}
              className={`p-3 border-b border-dark-100 cursor-pointer transition-colors ${
                selectedUsers.includes(user._id)
                  ? 'bg-primary-100 hover:bg-primary-200'
                  : 'hover:bg-dark-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark-900">{user.name}</p>
                    <p className="text-xs text-dark-500">
                      {user.email} • {user.role}
                      {user.department && ` • ${user.department}`}
                    </p>
                  </div>
                </div>
                {selectedUsers.includes(user._id) && (
                  <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-dark-500">
            <Users className="w-12 h-12 mx-auto mb-2 text-dark-300" />
            <p>No users found</p>
          </div>
        )}
      </div>

      <p className="text-xs text-dark-500 mt-2">
        {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
      </p>
    </div>
  );
}
