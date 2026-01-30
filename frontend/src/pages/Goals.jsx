import { useState, useEffect } from 'react';
import { Plus, Target, Calendar, TrendingUp, X } from 'lucide-react';
import { goalAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'daily',
    priority: 'medium',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    progress: 0,
    status: 'not-started'
  });

  useEffect(() => {
    fetchGoals();
  }, [filter]);

  const fetchGoals = async () => {
    try {
      const params = filter !== 'all' ? { type: filter } : {};
      const response = await goalAPI.getAll(params);
      setGoals(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch goals');
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
      await goalAPI.create(formData);
      toast.success('Goal created successfully!');
      setShowModal(false);
      setFormData({
        title: '',
        description: '',
        type: 'daily',
        priority: 'medium',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        progress: 0,
        status: 'not-started'
      });
      fetchGoals();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create goal');
    }
  };

  const statusColors = {
    'not-started': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Goals</h1>
          <p className="text-dark-600 mt-1">Track your daily, weekly, and monthly objectives</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus className="w-5 h-5" />
          New Goal
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'daily', 'weekly', 'monthly'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`btn ${filter === type ? 'btn-primary' : 'btn-secondary'} capitalize`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Goals List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : goals.length > 0 ? (
          goals.map((goal) => (
            <div key={goal._id} className="card p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-dark-900">{goal.title}</h3>
                    <span className={`badge capitalize ${statusColors[goal.status]}`}>
                      {goal.status}
                    </span>
                    <span className="badge badge-info capitalize">{goal.type}</span>
                  </div>
                  {goal.description && <p className="text-dark-600 text-sm">{goal.description}</p>}
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-dark-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(goal.startDate), 'MMM d')} - {format(new Date(goal.endDate), 'MMM d')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>{goal.progress}% Complete</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 w-full bg-dark-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-dark-500">No goals found. Create your first goal!</div>
        )}
      </div>

      {/* Create Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-dark-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-dark-900">Create New Goal</h2>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Goal Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="e.g., Review 2 research papers"
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
                  placeholder="Describe your goal in detail..."
                  rows={3}
                />
              </div>

              {/* Type and Priority Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Goal Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="input"
                    required
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
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
                  </select>
                </div>
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
              </div>

              {/* Progress and Status Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Initial Progress (%)
                  </label>
                  <input
                    type="number"
                    name="progress"
                    value={formData.progress}
                    onChange={handleInputChange}
                    className="input"
                    min="0"
                    max="100"
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
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  <Target className="w-5 h-5" />
                  Create Goal
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
