import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, FileText, CheckSquare, TrendingUp, Users, Activity, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { dashboardAPI, activityAPI } from '../services/api';
import { format } from 'date-fns';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function CollaborativeDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showActivities, setShowActivities] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      goals: { total: 0, completed: 0, inProgress: 0, notStarted: 0 },
      papers: { total: 0, inProgress: 0, submitted: 0, published: 0 },
      tasks: { total: 0, pending: 0, inProgress: 0, completed: 0 }
    },
    teamMembers: 0,
    goals: [],
    papers: [],
    tasks: [],
    activities: []
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      console.log('🔄 Fetching COLLABORATIVE dashboard (ALL users data)...');
      const response = await dashboardAPI.getShared();
      console.log('✅ Dashboard data received:', response.data.data);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('❌ Error fetching dashboard:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    try {
      await activityAPI.delete(activityId);
      toast.success('Activity deleted successfully!');
      fetchDashboard();
    } catch (error) {
      toast.error('Failed to delete activity');
    }
  };

  const statCards = [
    {
      title: 'Team Members',
      value: dashboardData.teamMembers,
      icon: Users,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Total Goals',
      value: dashboardData.stats.goals.total,
      subtitle: `${dashboardData.stats.goals.inProgress} in progress`,
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Papers',
      value: dashboardData.stats.papers.total,
      subtitle: `${dashboardData.stats.papers.published} published`,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Tasks',
      value: dashboardData.stats.tasks.total,
      subtitle: `${dashboardData.stats.tasks.pending} pending`,
      icon: CheckSquare,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="card p-8 bg-gradient-to-br from-primary-500 to-purple-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold mb-2">Welcome {user?.name}!</h1>
          <p className="text-primary-100 text-lg">
            🤝 Collaborative Research Lab Dashboard - Everyone's Progress
          </p>
          <p className="text-primary-200 text-sm mt-2">
            You can see all team members' goals, papers, and tasks here
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-6 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-dark-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-dark-600 mb-1">{stat.title}</p>
            {stat.subtitle && (
              <p className="text-xs text-dark-500">{stat.subtitle}</p>
            )}
          </div>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Goals Progress
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-dark-600">Completed</span>
                <span className="font-medium text-green-600">{dashboardData.stats.goals.completed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{width: `${(dashboardData.stats.goals.completed / (dashboardData.stats.goals.total || 1)) * 100}%`}}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-dark-600">In Progress</span>
                <span className="font-medium text-blue-600">{dashboardData.stats.goals.inProgress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{width: `${(dashboardData.stats.goals.inProgress / (dashboardData.stats.goals.total || 1)) * 100}%`}}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-dark-600">Not Started</span>
                <span className="font-medium text-gray-600">{dashboardData.stats.goals.notStarted}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-400 h-2 rounded-full"
                  style={{width: `${(dashboardData.stats.goals.notStarted / (dashboardData.stats.goals.total || 1)) * 100}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Papers Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-dark-600">Published</span>
              <span className="text-lg font-bold text-green-600">{dashboardData.stats.papers.published}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-dark-600">Submitted</span>
              <span className="text-lg font-bold text-orange-600">{dashboardData.stats.papers.submitted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-dark-600">In Progress</span>
              <span className="text-lg font-bold text-blue-600">{dashboardData.stats.papers.inProgress}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-green-600" />
            Tasks Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-dark-600">Completed</span>
              <span className="text-lg font-bold text-green-600">{dashboardData.stats.tasks.completed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-dark-600">In Progress</span>
              <span className="text-lg font-bold text-blue-600">{dashboardData.stats.tasks.inProgress}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-dark-600">Pending</span>
              <span className="text-lg font-bold text-orange-600">{dashboardData.stats.tasks.pending}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Goals */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-dark-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Team Goals
          </h2>
          <button
            onClick={() => navigate('/goals')}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View All →
          </button>
        </div>

        <div className="space-y-3">
          {dashboardData.goals.length > 0 ? (
            dashboardData.goals.slice(0, 5).map((goal) => (
              <div key={goal._id} className="p-4 border border-dark-200 rounded-lg hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-900">{goal.title}</h3>
                    <p className="text-sm text-dark-600 mt-1 line-clamp-2">{goal.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-dark-500">
                        👤 {goal.user?.name || 'Unknown'}
                      </span>
                      {goal.deadline && (
                        <span className="text-xs text-dark-500">
                          📅 {format(new Date(goal.deadline), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      goal.status === 'completed' ? 'bg-green-100 text-green-700' :
                      goal.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {goal.status === 'in-progress' ? 'In Progress' :
                       goal.status === 'not-started' ? 'Not Started' : 'Completed'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-dark-300 mx-auto mb-3" />
              <p className="text-dark-500">No goals yet</p>
              <p className="text-dark-400 text-sm mt-1">Create your first goal to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Team Papers */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-dark-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Team Papers
          </h2>
          <button
            onClick={() => navigate('/papers')}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View All →
          </button>
        </div>

        <div className="space-y-3">
          {dashboardData.papers.length > 0 ? (
            dashboardData.papers.slice(0, 5).map((paper) => (
              <div key={paper._id} className="p-4 border border-dark-200 rounded-lg hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-900">{paper.title}</h3>
                    <p className="text-sm text-dark-600 mt-1">{paper.journal || 'No journal specified'}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-dark-500">
                        👥 {paper.authors?.map(a => a.name).join(', ') || 'No authors'}
                      </span>
                      {paper.submissionDate && (
                        <span className="text-xs text-dark-500">
                          📅 {format(new Date(paper.submissionDate), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      paper.status === 'published' ? 'bg-green-100 text-green-700' :
                      paper.status === 'submitted' ? 'bg-orange-100 text-orange-700' :
                      paper.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {paper.status === 'in-progress' ? 'In Progress' :
                       paper.status === 'submitted' ? 'Submitted' :
                       paper.status === 'published' ? 'Published' : paper.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-dark-300 mx-auto mb-3" />
              <p className="text-dark-500">No papers yet</p>
              <p className="text-dark-400 text-sm mt-1">Add your first research paper!</p>
            </div>
          )}
        </div>
      </div>

      {/* Team Tasks */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-dark-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-green-600" />
            Team Tasks
          </h2>
          <button
            onClick={() => navigate('/tasks')}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View All →
          </button>
        </div>

        <div className="space-y-3">
          {dashboardData.tasks.length > 0 ? (
            dashboardData.tasks.slice(0, 5).map((task) => (
              <div key={task._id} className="p-4 border border-dark-200 rounded-lg hover:shadow-md transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-dark-900">{task.title}</h3>
                    <p className="text-sm text-dark-600 mt-1 line-clamp-2">{task.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-dark-500">
                        👤 Assigned to: {task.assignedTo?.name || 'Unassigned'}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs text-dark-500">
                          📅 {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </span>
                      )}
                      {task.priority && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === 'completed' ? 'bg-green-100 text-green-700' :
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {task.status === 'in-progress' ? 'In Progress' :
                       task.status === 'pending' ? 'Pending' : 'Completed'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <CheckSquare className="w-12 h-12 text-dark-300 mx-auto mb-3" />
              <p className="text-dark-500">No tasks yet</p>
              <p className="text-dark-400 text-sm mt-1">Create your first task!</p>
            </div>
          )}
        </div>
      </div>

      {/* Team Activity - Collapsible */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-dark-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-600" />
            Team Activity
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-dark-500">
              {dashboardData.activities.length} activities
            </span>
            <button
              onClick={() => setShowActivities(!showActivities)}
              className="btn btn-secondary text-sm flex items-center gap-2"
            >
              {showActivities ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide Activities
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show Activities
                </>
              )}
            </button>
          </div>
        </div>

        {showActivities && (
          <div className="space-y-3 mt-6">
            {dashboardData.activities.length > 0 ? (
              dashboardData.activities.slice(0, 20).map((activity, index) => (
                <div key={index} className="flex gap-4 p-3 rounded-lg hover:bg-dark-50 transition-colors group">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {activity.type?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-900">
                      <span className="text-primary-600">{activity.user?.name || 'Someone'}</span>
                      {' '}{activity.action}
                    </p>
                    <p className="text-xs text-dark-600 truncate">{activity.description}</p>
                    <p className="text-xs text-dark-400 mt-1">
                      {format(new Date(activity.createdAt), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                  {/* Delete button - only for supervisors */}
                  {['professor', 'admin'].includes(user?.role) && (
                    <button
                      onClick={() => handleDeleteActivity(activity._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity btn btn-ghost p-2 text-red-600 hover:bg-red-50"
                      title="Delete activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-dark-300 mx-auto mb-4" />
                <p className="text-dark-500 text-lg font-medium">No team activity yet</p>
                <p className="text-dark-400 text-sm mt-2">Start by creating goals, papers, or tasks!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('/goals')}
          className="card p-6 hover:shadow-lg transition-all text-left group"
        >
          <Target className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-dark-900 mb-1">Manage Goals</h3>
          <p className="text-sm text-dark-600">View and create research goals</p>
        </button>

        <button
          onClick={() => navigate('/papers')}
          className="card p-6 hover:shadow-lg transition-all text-left group"
        >
          <FileText className="w-8 h-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-dark-900 mb-1">Manage Papers</h3>
          <p className="text-sm text-dark-600">Track your research papers</p>
        </button>

        <button
          onClick={() => navigate('/tasks')}
          className="card p-6 hover:shadow-lg transition-all text-left group"
        >
          <CheckSquare className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-dark-900 mb-1">Manage Tasks</h3>
          <p className="text-sm text-dark-600">Organize your tasks</p>
        </button>
      </div>
    </div>
  );
}
