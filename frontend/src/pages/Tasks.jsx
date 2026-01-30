import { useState, useEffect } from 'react';
import { Plus, CheckSquare, X, Calendar, AlertCircle, Clock } from 'lucide-react';
import { taskAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import useAuthStore from '../store/authStore';

export default function Tasks() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pending',
    estimatedHours: ''
  });

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await taskAPI.getAll(params);
      setTasks(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        assignedTo: user._id,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined
      };
      await taskAPI.create(submitData);
      toast.success('Task created successfully!');
      setShowModal(false);
      resetForm();
      fetchTasks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.update(taskId, { status: newStatus });
      toast.success('Task status updated!');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending',
      estimatedHours: ''
    });
  };

  const statusColors = {
    'pending': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'review': 'bg-purple-100 text-purple-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };

  const priorityColors = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'urgent': 'bg-red-100 text-red-800'
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && formData.status !== 'completed';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Tasks</h1>
          <p className="text-dark-600 mt-1">Manage your assignments and deadlines</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'in-progress', 'review', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`btn ${filter === status ? 'btn-primary' : 'btn-secondary'} capitalize whitespace-nowrap`}
          >
            {status === 'all' ? 'All Tasks' : status.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} className="card p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckSquare className="w-5 h-5 text-primary-600" />
                    <h3 className="text-lg font-semibold text-dark-900">{task.title}</h3>
                    <span className={`badge capitalize ${statusColors[task.status]}`}>
                      {task.status.replace('-', ' ')}
                    </span>
                    <span className={`badge capitalize ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className="text-dark-600 text-sm mb-3">{task.description}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-dark-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                      {isOverdue(task.dueDate) && (
                        <span className="text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          Overdue
                        </span>
                      )}
                    </div>
                    
                    {task.estimatedHours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{task.estimatedHours}h estimated</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Status Update */}
                {task.status !== 'completed' && task.status !== 'cancelled' && (
                  <div className="ml-4">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className="input text-sm py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="card p-12 text-center">
            <CheckSquare className="w-16 h-16 text-dark-300 mx-auto mb-4" />
            <p className="text-dark-600 mb-2">No tasks found</p>
            <p className="text-dark-500 text-sm">Create your first task to get started!</p>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-dark-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-dark-900">Create New Task</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="btn btn-ghost p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="e.g., Complete literature review"
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
                  placeholder="Describe the task in detail..."
                  rows={3}
                />
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
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
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Due Date and Estimated Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    name="estimatedHours"
                    value={formData.estimatedHours}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="e.g., 8"
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  <CheckSquare className="w-5 h-5" />
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
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
