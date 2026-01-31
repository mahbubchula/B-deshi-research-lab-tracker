import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, FileText, CheckSquare, User, Mail, Building, Users, Calendar } from 'lucide-react';
import { userAPI } from '../services/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [studentData, setStudentData] = useState({
    user: null,
    stats: {
      goals: { total: 0, completed: 0, inProgress: 0 },
      papers: { total: 0, published: 0, inProgress: 0 },
      tasks: { total: 0, completed: 0, pending: 0 }
    }
  });
  const [goals, setGoals] = useState([]);
  const [papers, setPapers] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const fetchStudentData = async () => {
    try {
      console.log('Fetching student data for ID:', id);

      const [userRes, goalsRes, papersRes, tasksRes] = await Promise.all([
        userAPI.getOne(id),
        userAPI.getUserGoals(id),
        userAPI.getUserPapers(id),
        userAPI.getUserTasks(id)
      ]);

      console.log('Student detail responses:', {
        user: userRes.data,
        goals: goalsRes.data,
        papers: papersRes.data,
        tasks: tasksRes.data
      });

      setStudentData(userRes.data.data);
      setGoals(goalsRes.data.data || []);
      setPapers(papersRes.data.data || []);
      setTasks(tasksRes.data.data || []);
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!studentData.user) {
    return (
      <div className="text-center py-12">
        <p className="text-dark-600">Student not found</p>
        <button onClick={() => navigate('/supervisor/students')} className="btn btn-primary mt-4">
          Back to Students
        </button>
      </div>
    );
  }

  const statusColors = {
    'in-progress': 'bg-blue-100 text-blue-800',
    'not-started': 'bg-gray-100 text-gray-800',
    'completed': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'submitted': 'bg-purple-100 text-purple-800',
    'under-review': 'bg-orange-100 text-orange-800',
    'published': 'bg-emerald-100 text-emerald-800',
    'accepted': 'bg-green-100 text-green-800'
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/supervisor/students')}
        className="btn btn-ghost"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Students
      </button>

      {/* Student Header */}
      <div className="card p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {studentData.user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-dark-900 mb-2">{studentData.user.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 text-dark-600">
                <Mail className="w-4 h-4" />
                {studentData.user.email}
              </div>
              {studentData.user.department && (
                <div className="flex items-center gap-2 text-dark-600">
                  <Building className="w-4 h-4" />
                  {studentData.user.department}
                </div>
              )}
              {studentData.user.labGroup && (
                <div className="flex items-center gap-2 text-dark-600">
                  <Users className="w-4 h-4" />
                  {studentData.user.labGroup}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  studentData.user.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {studentData.user.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="px-2 py-1 rounded text-xs font-medium bg-primary-100 text-primary-700 capitalize">
                  {studentData.user.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-dark-900">{studentData.stats.goals.total}</h3>
              <p className="text-sm text-dark-600">Total Goals</p>
            </div>
          </div>
          <div className="text-sm text-dark-600 space-y-1">
            <div className="flex justify-between">
              <span>Completed:</span>
              <span className="font-medium">{studentData.stats.goals.completed}</span>
            </div>
            <div className="flex justify-between">
              <span>In Progress:</span>
              <span className="font-medium">{studentData.stats.goals.inProgress}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-dark-900">{studentData.stats.papers.total}</h3>
              <p className="text-sm text-dark-600">Total Papers</p>
            </div>
          </div>
          <div className="text-sm text-dark-600 space-y-1">
            <div className="flex justify-between">
              <span>Published:</span>
              <span className="font-medium">{studentData.stats.papers.published}</span>
            </div>
            <div className="flex justify-between">
              <span>In Progress:</span>
              <span className="font-medium">{studentData.stats.papers.inProgress}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-dark-900">{studentData.stats.tasks.total}</h3>
              <p className="text-sm text-dark-600">Total Tasks</p>
            </div>
          </div>
          <div className="text-sm text-dark-600 space-y-1">
            <div className="flex justify-between">
              <span>Completed:</span>
              <span className="font-medium">{studentData.stats.tasks.completed}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending:</span>
              <span className="font-medium">{studentData.stats.tasks.pending}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="border-b border-dark-200">
          <nav className="flex gap-4 px-6" aria-label="Tabs">
            {['overview', 'goals', 'papers', 'tasks'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-dark-500 hover:text-dark-700 hover:border-dark-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-dark-900 mb-4">Recent Activity Summary</h3>
                <div className="grid gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-dark-700">
                      <strong>{goals.length}</strong> total goals •{' '}
                      <strong>{goals.filter(g => g.status === 'completed').length}</strong> completed
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-dark-700">
                      <strong>{papers.length}</strong> total papers •{' '}
                      <strong>{papers.filter(p => p.status === 'published').length}</strong> published
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-dark-700">
                      <strong>{tasks.length}</strong> total tasks •{' '}
                      <strong>{tasks.filter(t => t.status === 'completed').length}</strong> completed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-4">
              {goals.length > 0 ? (
                goals.map((goal) => (
                  <div key={goal._id} className="p-4 border border-dark-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-dark-900">{goal.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusColors[goal.status]}`}>
                        {goal.status.replace('-', ' ')}
                      </span>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-dark-600 mb-2">{goal.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-dark-500">
                      <span className="capitalize">{goal.type} Goal</span>
                      <span>Progress: {goal.progress}%</span>
                      <span>Priority: {goal.priority}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-dark-500 py-8">No goals found</p>
              )}
            </div>
          )}

          {/* Papers Tab */}
          {activeTab === 'papers' && (
            <div className="space-y-4">
              {papers.length > 0 ? (
                papers.map((paper) => (
                  <div key={paper._id} className="p-4 border border-dark-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-dark-900">{paper.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusColors[paper.status]}`}>
                        {paper.status.replace('-', ' ')}
                      </span>
                    </div>
                    {paper.abstract && (
                      <p className="text-sm text-dark-600 mb-2 line-clamp-2">{paper.abstract}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-dark-500">
                      {paper.venue?.name && <span>{paper.venue.name}</span>}
                      {paper.venue?.type && <span className="capitalize">{paper.venue.type}</span>}
                      {paper.authors && <span>{paper.authors.length} author(s)</span>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-dark-500 py-8">No papers found</p>
              )}
            </div>
          )}

          {/* Tasks Tab */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={task._id} className="p-4 border border-dark-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-dark-900">{task.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${statusColors[task.status]}`}>
                        {task.status}
                      </span>
                    </div>
                    {task.description && (
                      <p className="text-sm text-dark-600 mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-dark-500">
                      <span>Priority: {task.priority}</span>
                      {task.dueDate && (
                        <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                      )}
                      {task.estimatedHours && <span>{task.estimatedHours}h estimated</span>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-dark-500 py-8">No tasks found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
