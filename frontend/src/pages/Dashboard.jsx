import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, FileText, CheckSquare, TrendingUp, Calendar, Clock } from 'lucide-react';
import { goalAPI, taskAPI, paperAPI, activityAPI } from '../services/api';
import { format } from 'date-fns';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    goals: { total: 0, completed: 0, inProgress: 0 },
    papers: { total: 0, submitted: 0, accepted: 0 },
    tasks: { total: 0, completed: 0, pending: 0 }
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...');

      const [goalsRes, tasksRes, papersRes, activitiesRes] = await Promise.all([
        goalAPI.getAll().catch((err) => {
          console.error('Goals fetch error:', err);
          return { data: { data: [], count: 0 } };
        }),
        taskAPI.getAll().catch((err) => {
          console.error('Tasks fetch error:', err);
          return { data: { data: [], count: 0 } };
        }),
        paperAPI.getAll().catch((err) => {
          console.error('Papers fetch error:', err);
          return { data: { data: [], count: 0 } };
        }),
        activityAPI.getAll().catch((err) => {
          console.error('Activities fetch error:', err);
          return { data: { data: [], count: 0 } };
        })
      ]);

      console.log('API Responses:', {
        goals: goalsRes.data,
        tasks: tasksRes.data,
        papers: papersRes.data,
        activities: activitiesRes.data
      });

      // Calculate goal stats
      const goals = goalsRes.data.data || [];
      const goalStats = {
        total: goals.length,
        completed: goals.filter(g => g.status === 'completed').length,
        inProgress: goals.filter(g => g.status === 'in-progress').length
      };

      // Calculate task stats
      const tasks = tasksRes.data.data || [];
      const taskStats = {
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        pending: tasks.filter(t => t.status === 'pending').length
      };

      // Calculate paper stats
      const papers = papersRes.data.data || [];
      const paperStats = {
        total: papers.length,
        submitted: papers.filter(p => ['submitted', 'under-review'].includes(p.status)).length,
        accepted: papers.filter(p => ['accepted', 'published'].includes(p.status)).length
      };

      console.log('Calculated stats:', { goalStats, taskStats, paperStats });

      setStats({
        goals: goalStats,
        tasks: taskStats,
        papers: paperStats
      });

      setActivities(activitiesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Active Goals',
      value: stats.goals.inProgress,
      total: stats.goals.total,
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Pending Tasks',
      value: stats.tasks.pending,
      total: stats.tasks.total,
      icon: CheckSquare,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Papers in Progress',
      value: stats.papers.total - stats.papers.accepted,
      total: stats.papers.total,
      icon: FileText,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Completion Rate',
      value: stats.goals.total > 0 ? Math.round((stats.goals.completed / stats.goals.total) * 100) : 0,
      suffix: '%',
      icon: TrendingUp,
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
      {/* Welcome Banner */}
      <div className="card p-8 bg-gradient-to-br from-primary-500 to-purple-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold mb-2">Good {getTimeOfDay()}, {user?.name}!</h1>
          <p className="text-primary-100 text-lg">
            You have {stats.tasks.pending} pending task{stats.tasks.pending !== 1 ? 's' : ''} and {stats.goals.inProgress} active goal{stats.goals.inProgress !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-6 hover:shadow-lg transition-all cursor-pointer" onClick={() => {
            if (stat.title.includes('Goals')) navigate('/goals');
            if (stat.title.includes('Tasks')) navigate('/tasks');
            if (stat.title.includes('Papers')) navigate('/papers');
          }}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              {stat.total !== undefined && (
                <span className="text-xs text-dark-500 font-medium">
                  {stat.total} total
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-dark-900 mb-1">
              {stat.value}{stat.suffix || ''}
            </h3>
            <p className="text-sm text-dark-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-dark-900">Recent Activity</h2>
            <Clock className="w-5 h-5 text-dark-400" />
          </div>
          
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-lg hover:bg-dark-50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {activity.type?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-900">{activity.action}</p>
                    <p className="text-xs text-dark-600 truncate">{activity.description}</p>
                    <p className="text-xs text-dark-500 mt-1">
                      {format(new Date(activity.createdAt), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-dark-300 mx-auto mb-3" />
                <p className="text-dark-500">No recent activity</p>
                <p className="text-xs text-dark-400 mt-1">Start by creating a goal or task!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-dark-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/goals')}
              className="w-full btn btn-primary justify-start"
            >
              <Target className="w-5 h-5" />
              Create Goal
            </button>
            <button 
              onClick={() => navigate('/papers')}
              className="w-full btn btn-secondary justify-start"
            >
              <FileText className="w-5 h-5" />
              New Paper
            </button>
            <button 
              onClick={() => navigate('/tasks')}
              className="w-full btn btn-secondary justify-start"
            >
              <CheckSquare className="w-5 h-5" />
              Add Task
            </button>
            <button 
              onClick={() => navigate('/goals')}
              className="w-full btn btn-secondary justify-start"
            >
              <Calendar className="w-5 h-5" />
              View Goals
            </button>
          </div>

          {/* Stats Summary */}
          <div className="mt-6 pt-6 border-t border-dark-200">
            <h3 className="text-sm font-semibold text-dark-700 mb-3">This Week</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-600">Goals Completed</span>
                <span className="font-medium text-dark-900">{stats.goals.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Tasks Completed</span>
                <span className="font-medium text-dark-900">{stats.tasks.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-600">Papers Submitted</span>
                <span className="font-medium text-dark-900">{stats.papers.submitted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}
