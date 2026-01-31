import { useState, useEffect } from 'react';
import { Plus, ListTodo, Calendar, X, Edit2, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { personalTodoAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import useAuthStore from '../store/authStore';

export default function PersonalTodos() {
  const { user } = useAuthStore();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'daily',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchTodos();
    fetchStats();
  }, [filterType, filterStatus]);

  const fetchTodos = async () => {
    try {
      const params = {};
      if (filterType !== 'all') params.type = filterType;
      if (filterStatus !== 'all') params.status = filterStatus;

      const response = await personalTodoAPI.getAll(params);
      setTodos(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch to-dos');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await personalTodoAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTodo) {
        await personalTodoAPI.update(editingTodo._id, formData);
        toast.success('To-do updated successfully!');
      } else {
        await personalTodoAPI.create(formData);
        toast.success('To-do created successfully!');
      }
      setShowModal(false);
      setEditingTodo(null);
      resetForm();
      fetchTodos();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description || '',
      type: todo.type,
      priority: todo.priority,
      status: todo.status,
      dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
      notes: todo.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this to-do?')) return;

    try {
      await personalTodoAPI.delete(id);
      toast.success('To-do deleted successfully!');
      fetchTodos();
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete to-do');
    }
  };

  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      await personalTodoAPI.update(id, { status: newStatus });
      toast.success('Status updated!');
      fetchTodos();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'daily',
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      notes: ''
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTodo(null);
    resetForm();
  };

  const statusColors = {
    'pending': 'bg-orange-100 text-orange-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800'
  };

  const priorityColors = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'urgent': 'bg-red-100 text-red-800'
  };

  const typeIcons = {
    'daily': '📅',
    'weekly': '📆',
    'monthly': '🗓️',
    'yearly': '📊'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">My Personal To-Do List</h1>
          <p className="text-dark-600 mt-1">📝 Manage your daily, weekly, monthly, and yearly tasks</p>
        </div>
        <button
          onClick={() => { setEditingTodo(null); setShowModal(true); }}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          New To-Do
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-600">Total</p>
                <p className="text-2xl font-bold text-dark-900">{stats.total}</p>
              </div>
              <ListTodo className="w-8 h-8 text-primary-600" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.byStatus.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.byStatus.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.byStatus.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-dark-700 mb-2">Filter by Type</label>
            <div className="flex gap-2 flex-wrap">
              {['all', 'daily', 'weekly', 'monthly', 'yearly'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`btn ${filterType === type ? 'btn-primary' : 'btn-secondary'} capitalize`}
                >
                  {type === 'all' ? 'All' : `${typeIcons[type]} ${type}`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-dark-700 mb-2">Filter by Status</label>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'in-progress', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`btn ${filterStatus === status ? 'btn-primary' : 'btn-secondary'} capitalize`}
                >
                  {status === 'all' ? 'All' : status.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* To-Do List */}
      <div className="grid gap-4">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div key={todo._id} className="card p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-dark-900">{todo.title}</h3>
                    <span className="text-2xl">{typeIcons[todo.type]}</span>
                    <span className={`badge capitalize ${statusColors[todo.status]}`}>
                      {todo.status.replace('-', ' ')}
                    </span>
                    <span className={`badge capitalize ${priorityColors[todo.priority]}`}>
                      {todo.priority}
                    </span>
                  </div>
                  {todo.description && (
                    <p className="text-dark-600 text-sm mb-3">{todo.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-sm text-dark-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="capitalize">{todo.type}</span>
                    </div>
                    {todo.dueDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Due: {format(new Date(todo.dueDate), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                    {todo.completedAt && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Completed: {format(new Date(todo.completedAt), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>

                  {todo.notes && (
                    <div className="mt-3 p-3 bg-dark-50 rounded-lg">
                      <p className="text-sm text-dark-700">📝 {todo.notes}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 ml-4">
                  {todo.status !== 'completed' && (
                    <button
                      onClick={() => handleQuickStatusChange(todo._id, 'completed')}
                      className="btn btn-ghost p-2 text-green-600 hover:bg-green-50"
                      title="Mark as completed"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(todo)}
                    className="btn btn-ghost p-2 text-blue-600 hover:bg-blue-50"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="btn btn-ghost p-2 text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card p-12 text-center">
            <ListTodo className="w-16 h-16 text-dark-300 mx-auto mb-4" />
            <p className="text-dark-600 mb-2">No to-dos found</p>
            <p className="text-dark-500 text-sm">Create your first to-do to get organized!</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-dark-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-dark-900">
                {editingTodo ? 'Edit To-Do' : 'Create New To-Do'}
              </h2>
              <button onClick={handleCloseModal} className="btn btn-ghost p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="e.g., Review student submissions"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input min-h-[100px]"
                  placeholder="Describe the task..."
                  rows={3}
                />
              </div>

              {/* Type and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="daily">📅 Daily</option>
                    <option value="weekly">📆 Weekly</option>
                    <option value="monthly">🗓️ Monthly</option>
                    <option value="yearly">📊 Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Due Date and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="input min-h-[80px]"
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  <ListTodo className="w-5 h-5" />
                  {editingTodo ? 'Update To-Do' : 'Create To-Do'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
