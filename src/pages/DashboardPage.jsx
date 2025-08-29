import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const DashboardPage = () => {
  const { 
    user, 
    stats, 
    statsLoading, 
    fetchStats, 
    tasks, 
    fetchTasks,
    tasksLoading 
  } = useApp();

  useEffect(() => {
    fetchStats();
    fetchTasks({ limit: 5, sort: 'createdAt:desc' });
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      todo: 'bg-gray-50 text-gray-700 border-gray-400',
      'in-progress': 'bg-blue-50 text-blue-700 border-blue-400',
      done: 'bg-green-50 text-green-700 border-green-400',
    };
    return colors[status] || colors.todo;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-blue-50 text-blue-700 border-blue-400',
      medium: 'bg-yellow-50 text-yellow-700 border-yellow-400',
      high: 'bg-red-50 text-red-700 border-red-400',
    };
    return colors[priority] || colors.medium;
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const taskDate = new Date(date);
    const diffTime = Math.abs(now - taskDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays < 7) return `${diffDays} days ago`;
    return taskDate.toLocaleDateString();
  };

  const totalTasks = stats.tasksByStatus.todo + stats.tasksByStatus['in-progress'] + stats.tasksByStatus.done;
  const completionRate = totalTasks > 0 ? Math.round((stats.tasksByStatus.done / totalTasks) * 100) : 0;

  if (statsLoading && tasksLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of your tasks and progress
          </p>
        </div>
        <Link to="/tasks">
          <Button variant="blue_btn">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              {completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasksByStatus['in-progress']}</div>
            <p className="text-xs text-muted-foreground">
              Active tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Done</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasksByStatus.done}</div>
            <p className="text-xs text-muted-foreground">
              Tasks finished
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>Your task completion progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2 [&>div]:bg-blue-500" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">To Do</span>
                <Badge variant="secondary">{stats.tasksByStatus.todo}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Progress</span>
                <Badge className="bg-blue-600">{stats.tasksByStatus['in-progress']}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Done</span>
                <Badge variant="success">{stats.tasksByStatus.done}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Your latest task activity</CardDescription>
              </div>
              <Link to="/tasks">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <CheckSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No tasks yet</p>
                <Link to="/tasks">
                  <Button variant="outline" size="sm" className="mt-2">
                    Create your first task
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatRelativeTime(task.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge className={getPriorityColor(task.priority)} variant="secondary">
                        {task.priority}
                      </Badge>
                      <Badge className={getStatusColor(task.status)} variant="outline">
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin Section */}
      {user?.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Admin Overview</CardTitle>
            <CardDescription>System-wide statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{stats.userCount}</div>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
              <div className="text-center">
                <CheckSquare className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{stats.totalTasks}</div>
                <p className="text-sm text-gray-600">All Tasks</p>
              </div>
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
                <div className="text-2xl font-bold">{stats.overdueTasks}</div>
                <p className="text-sm text-gray-600">Overdue Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {stats.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest changes and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.action === 'create' ? 'bg-green-500' :
                    activity.action === 'update' ? 'bg-blue-500' : 'bg-red-500'
                  }`} />
                  <span className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{activity.userId?.name}</span>
                    {' '}
                    {activity.action === 'create' ? 'created' : 
                     activity.action === 'update' ? 'updated' : 'deleted'}
                    {' '}
                    <span className="font-medium">{activity.taskId?.title}</span>
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardPage;