import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Target, FileText, CheckSquare, TrendingUp, Activity, Eye } from 'lucide-react';
import { supervisorAPI } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function SupervisorDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      users: { total: 0, active: 0 },
      goals: { total: 0, completed: 0, inProgress: 0 },
      papers: { total: 0, published: 0, underReview: 0, inProgress: 0 },
      tasks: { total: 0, completed: 0, pending: 0, inProgress: 0 }
    },
    users: [],
    recentActivities: []
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      console.log('Fetching supervisor dashboard...');
      const response = await supervisorAPI.getDashboard();
      console.log('Supervisor dashboard response:', response.data);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching supervisor dashboard:', error);
      toast.error('Failed to load supervisor dashboard');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Students',
      value: dashboardData.stats.users.total,
      subtitle: `${dashboardData.stats.users.active} active`,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Goals',
      value: dashboardData.stats.goals.total,
      subtitle: `${dashboardData.stats.goals.completed} completed`,
      icon: Target,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
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
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
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
      {/* Header */}
      <div className="card p-8 bg-gradient-to-br from-primary-500 to-purple-600 text-white">
        <h1 className="text-3xl font-bold mb-2">Supervisor Dashboard</h1>
        <p className="text-primary-100 text-lg">
          Manage and monitor all students' research activities
        </p>
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
            <p className="text-xs text-dark-500">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Students List */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-dark-900">Students</h2>
            <button
              onClick={() => navigate('/supervisor/students')}
              className="btn btn-secondary"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {dashboardData.users.length > 0 ? (
              dashboardData.users.slice(0, 8).map((student) => (
                <div
                  key={student._id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-dark-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/supervisor/students/${student._id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                      {student.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-dark-900">{student.name}</p>
                      <p className="text-xs text-dark-600">{student.email}</p>
                      {student.department && (
                        <p className="text-xs text-dark-500">{student.department}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      student.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button className="btn btn-ghost p-2 text-primary-600 hover:bg-primary-50">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-dark-300 mx-auto mb-3" />
                <p className="text-dark-500">No students found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-dark-900">Recent Activity</h2>
            <Activity className="w-5 h-5 text-dark-400" />
          </div>

          <div className="space-y-4">
            {dashboardData.recentActivities.length > 0 ? (
              dashboardData.recentActivities.slice(0, 10).map((activity, index) => (
                <div key={index} className="flex gap-3 pb-3 border-b border-dark-100 last:border-0">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {activity.type?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-dark-900 truncate">
                      {activity.user?.name || 'Unknown User'}
                    </p>
                    <p className="text-xs text-dark-600 truncate">{activity.action}</p>
                    <p className="text-xs text-dark-500 truncate">{activity.description}</p>
                    <p className="text-xs text-dark-400 mt-1">
                      {format(new Date(activity.createdAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-dark-300 mx-auto mb-3" />
                <p className="text-dark-500 text-sm">No recent activity</p>
              </div>
            )}
          </div>

          {dashboardData.recentActivities.length > 10 && (
            <button
              onClick={() => navigate('/supervisor/activities')}
              className="w-full mt-4 btn btn-secondary"
            >
              View All Activities
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-sm font-semibold text-dark-700 mb-3">Goals Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark-600">In Progress</span>
              <span className="font-medium text-dark-900">{dashboardData.stats.goals.inProgress}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-600">Completed</span>
              <span className="font-medium text-dark-900">{dashboardData.stats.goals.completed}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-600">Total</span>
              <span className="font-medium text-dark-900">{dashboardData.stats.goals.total}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold text-dark-700 mb-3">Papers Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark-600">In Progress</span>
              <span className="font-medium text-dark-900">{dashboardData.stats.papers.inProgress}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-600">Under Review</span>
              <span className="font-medium text-dark-900">{dashboardData.stats.papers.underReview}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-600">Published</span>
              <span className="font-medium text-dark-900">{dashboardData.stats.papers.published}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-sm font-semibold text-dark-700 mb-3">Tasks Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark-600">Pending</span>
              <span className="font-medium text-dark-900">{dashboardData.stats.tasks.pending}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-600">In Progress</span>
              <span className="font-medium text-dark-900">{dashboardData.stats.tasks.inProgress}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-600">Completed</span>
              <span className="font-medium text-dark-900">{dashboardData.stats.tasks.completed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
