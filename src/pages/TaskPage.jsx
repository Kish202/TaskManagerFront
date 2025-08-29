import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  User,
  Tag,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TasksPage = () => {
  const {
    tasks,
    tasksLoading,
    tasksPagination,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    users,
    fetchUsers,
    user,
    error,
    clearError
  } = useApp();

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    assignee: '',
    page: 1,
    limit: 10
  });

  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    tags: '',
    assignee: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState({ open: false, task: null });

  useEffect(() => {
    fetchTasks(filters);
  }, [filters]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, []);

 const handleFilterChange = (key, value) => {
  setFilters(prev => ({ 
    ...prev, 
    [key]: value, 
    page: key === 'page' ? value : 1 
  }));
};

  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      assignee: '',
      page: 1,
      limit: 10
    });
  };

  const openTaskDialog = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags ? task.tags.join(', ') : '',
        assignee: task.assignee?._id || ''
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        tags: '',
        assignee: ''
      });
    }
    setShowTaskDialog(true);
    if (error) clearError();
  };

  const closeTaskDialog = () => {
    setShowTaskDialog(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      tags: '',
      assignee: ''
    });
  };

  const handleFormChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    const taskData = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      dueDate: formData.dueDate || null,
      assignee: formData.assignee || null
    };

    let result;
    if (editingTask) {
      result = await updateTask(editingTask._id, taskData);
    } else {
      result = await createTask(taskData);
    }

    setFormLoading(false);

    if (result.success) {
      closeTaskDialog();
    }
  };

  const handleDelete = async (taskId) => {
    const result = await deleteTask(taskId);
    if (result.success) {
      setDeleteDialog({ open: false, task: null });
    }
  };

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

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track your tasks
          </p>
        </div>
        <Button onClick={() => openTaskDialog()} variant="blue_btn">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 lg:justify-start">
        <div className="sm:col-span-2 lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={filters.search}
              onChange={handleSearch}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="w-full cursor-pointer">
          <Select value={filters.status || "all-status"} onValueChange={(value) => handleFilterChange('status', value === 'all-status' ? '' : value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Select value={filters.priority || "all-priority"} onValueChange={(value) => handleFilterChange('priority', value === 'all-priority' ? '' : value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-priority">All priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full">
          <Button variant="outline" onClick={clearFilters} className="w-full">
            <Filter className="h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks ({tasksPagination.totalItems})</CardTitle>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-4 text-sm font-medium text-gray-900">No tasks found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filters.search || filters.status || filters.priority ?
                  'Try adjusting your filters' :
                  'Get started by creating a new task'
                }
              </p>
              {!filters.search && !filters.status && !filters.priority && (
                <Button onClick={() => openTaskDialog()} className="mt-4" variant="blue_btn">
                  <Plus className="h-4 w-4" />
                  Create Task
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <Card key={task._id} className={`${isOverdue(task.dueDate) ? 'border-red-200 bg-red-50' : ''}`}>
                  <CardContent className="px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {task.title}
                          </h3>
                          {isOverdue(task.dueDate) && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>

                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {task.dueDate && (
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(task.dueDate)}
                            </div>
                          )}
                          {task.assignee && (
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {task.assignee.name}
                            </div>
                          )}
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              {task.tags.slice(0, 2).join(' - ')}
                              {task.tags.length > 2 && '...'}
                            </div>
                          )}
                          <div>Created by {task.createdBy?.name}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex flex-col items-end space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(task.status)} variant="secondary">
                              {task.status}
                            </Badge>
                            <Badge className={getPriorityColor(task.priority)} variant="outline">
                              {task.priority}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openTaskDialog(task)}
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteDialog({ open: true, task })}
                            className="cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {tasksPagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={tasksPagination.currentPage === 1}
                onClick={() => handleFilterChange('page', tasksPagination.currentPage - 1)}
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {tasksPagination.currentPage} of {tasksPagination.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={tasksPagination.currentPage === tasksPagination.totalPages}
                onClick={() => handleFilterChange('page', tasksPagination.currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Form Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </DialogTitle>
            <DialogDescription>
              {editingTask ? 'Update the task details below.' : 'Fill in the details to create a new task.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                placeholder="Enter task description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleFormChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleFormChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleFormChange('dueDate', e.target.value)}
                />
              </div>

              {user?.role === 'admin' && (
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select value={formData.assignee || "unassigned"} onValueChange={(value) => handleFormChange('assignee', value === 'unassigned' ? '' : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {users.map((userItem) => (
                        <SelectItem key={userItem._id} value={userItem._id}>
                          {userItem.name} ({userItem.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleFormChange('tags', e.target.value)}
                placeholder="Enter tags separated by commas"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={closeTaskDialog}>
                Cancel
              </Button>
              <Button type="submit" variant="blue_btn" disabled={formLoading}>
                {formLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editingTask ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editingTask ? 'Update Task' : 'Create Task'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, task: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.task?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, task: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(deleteDialog.task?._id)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksPage;