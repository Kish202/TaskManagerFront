import React, { useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Activity,
  Calendar
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const StatsPage = () => {
  const { 
    stats, 
    statsLoading, 
    fetchStats,
    user 
  } = useApp();

  useEffect(() => {
    fetchStats();
  }, []);

  const formatRelativeTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffTime = Math.abs(now - activityDate);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const getActivityIcon = (action) => {
    switch (action) {
      case 'create':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'update':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'delete':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityText = (action) => {
    switch (action) {
      case 'create':
        return 'created';
      case 'update':
        return 'updated';
      case 'delete':
        return 'deleted';
      default:
        return 'modified';
    }
  };

  const totalTasks = stats.tasksByStatus.todo + stats.tasksByStatus['in-progress'] + stats.tasksByStatus.done;
  const completionRate = totalTasks > 0 ? Math.round((stats.tasksByStatus.done / totalTasks) * 100) : 0;
  const inProgressRate = totalTasks > 0 ? Math.round((stats.tasksByStatus['in-progress'] / totalTasks) * 100) : 0;
  const todoRate = totalTasks > 0 ? Math.round((stats.tasksByStatus.todo / totalTasks) * 100) : 0;

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
          Statistics & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Insights into your productivity and task management
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground">
              All time tasks created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Tasks completed successfully
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tasksByStatus['in-progress']}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Task Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Breakdown of tasks by current status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center">
                  Completed
                </span>
                <span>{stats.tasksByStatus.done} ({completionRate}%)</span>
              </div>
              <Progress value={completionRate} className="h-2 [&>div]:bg-blue-500" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center">
                  In Progress
                </span>
                <span>{stats.tasksByStatus['in-progress']} ({inProgressRate}%)</span>
              </div>
              <Progress value={inProgressRate} className="h-2 [&>div]:bg-blue-500" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center">
                  To Do
                </span>
                <span>{stats.tasksByStatus.todo} ({todoRate}%)</span>
              </div>
              <Progress value={todoRate} className="h-2 [&>div]:bg-blue-500" />
            </div>

            {stats.overdueTasks > 0 && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">
                    {stats.overdueTasks} overdue task{stats.overdueTasks > 1 ? 's' : ''} need attention
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Priority Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Tasks categorized by priority level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">High Priority</span>
                </div>
                <Badge variant="destructive">{stats.tasksByPriority.high}</Badge>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Medium Priority</span>
                </div>
                <Badge variant="secondary">{stats.tasksByPriority.medium}</Badge>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Low Priority</span>
                </div>
                <Badge variant="outline">{stats.tasksByPriority.low}</Badge>
              </div>
            </div>

            {/* Priority insights */}
            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex justify-between">
                <span>Most common priority:</span>
                <span className="font-medium">
                  {Object.entries(stats.tasksByPriority).reduce((a, b) => 
                    stats.tasksByPriority[a[0]] > stats.tasksByPriority[b[0]] ? a : b
                  )[0]}
                </span>
              </div>
              
              {stats.tasksByPriority.high > 0 && (
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-orange-700 dark:text-orange-300 text-xs">
                  Focus on {stats.tasksByPriority.high} high-priority task{stats.tasksByPriority.high > 1 ? 's' : ''} first
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Stats */}
      {user?.role === 'admin' && stats.userCount && (
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Platform-wide statistics (Admin view)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold">{stats.userCount}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-2xl font-bold">{stats.totalTasks}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">All Tasks</p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-2xl font-bold">{completionRate}%</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">System Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {stats.recentActivity && stats.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest task changes and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">{activity.userId?.name || 'Unknown user'}</span>
                      {' '}
                      {getActivityText(activity.action)}
                      {' '}
                      <span className="font-medium">"{activity.taskId?.title || 'Unknown task'}"</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {activity.action}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {stats.recentActivity.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>Key metrics and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Productivity Score</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Task Completion</span>
                  <span>{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2 [&>div]:bg-blue-500" />
                
                <div className="text-xs text-gray-500 mt-2">
                  {completionRate >= 80 ? 'Excellent productivity!' :
                   completionRate >= 60 ? 'Good progress, keep it up!' :
                   completionRate >= 40 ? 'Room for improvement' :
                   'Focus on completing more tasks'}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Average priority:</span>
                  <span className="font-medium">
                    {stats.tasksByPriority.high > stats.tasksByPriority.medium + stats.tasksByPriority.low ? 'High' :
                     stats.tasksByPriority.medium > stats.tasksByPriority.low ? 'Medium' : 'Low'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tasks per status:</span>
                  <span className="font-medium">
                    {Math.round(totalTasks / 3)} avg
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span>Overdue rate:</span>
                  <span className={`font-medium ${stats.overdueTasks > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {totalTasks > 0 ? Math.round((stats.overdueTasks / totalTasks) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Recommendations
            </h4>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              {stats.overdueTasks > 0 && (
                <li>• Address {stats.overdueTasks} overdue task{stats.overdueTasks > 1 ? 's' : ''} immediately</li>
              )}
              {stats.tasksByStatus['in-progress'] > stats.tasksByStatus.done && (
                <li>• Focus on completing in-progress tasks before starting new ones</li>
              )}
              {stats.tasksByPriority.high > 5 && (
                <li>• Consider breaking down high-priority tasks into smaller chunks</li>
              )}
              {completionRate < 50 && (
                <li>• Set daily goals to improve task completion rate</li>
              )}
              {stats.tasksByStatus.todo > 10 && (
                <li>• Review and prioritize your backlog of pending tasks</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsPage;