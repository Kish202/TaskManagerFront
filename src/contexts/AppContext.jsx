import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, tasksAPI, usersAPI, statsAPI } from '@/lib/api';

const AppContext = createContext();

export function AppProvider({ children }) {

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksPagination, setTasksPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersPagination, setUsersPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const [stats, setStats] = useState({
    tasksByStatus: { todo: 0, 'in-progress': 0, done: 0 },
    tasksByPriority: { low: 0, medium: 0, high: 0 },
    overdueTasks: 0,
    totalTasks: 0,
    userCount: null,
    recentActivity: [],
  });
  const [statsLoading, setStatsLoading] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setAuthLoading(true);
      const response = await authAPI.getProfile();
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setAuthLoading(true);
      setError(null);
      const response = await authAPI.login(credentials);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setAuthLoading(true);
      setError(null);
      const response = await authAPI.register(userData);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setTasks([]);
      setUsers([]);
      setStats({
        tasksByStatus: { todo: 0, 'in-progress': 0, done: 0 },
        tasksByPriority: { low: 0, medium: 0, high: 0 },
        overdueTasks: 0,
        totalTasks: 0,
        userCount: null,
        recentActivity: [],
      });
    }
  };

  const fetchTasks = async (filters = {}) => {
    try {
      setTasksLoading(true);
      setError(null);
      const response = await tasksAPI.getTasks(filters);
      setTasks(response.data.tasks);
      setTasksPagination(response.data.pagination);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setTasksLoading(false);
    }
  };

  const getTask = async (id) => {
    try {
      const response = await tasksAPI.getTask(id);
      return { success: true, data: response.data.task };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const createTask = async (taskData) => {
    try {
      const response = await tasksAPI.createTask(taskData);
      await fetchTasks(); 
      return { success: true, data: response.data.task };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const response = await tasksAPI.updateTask(id, taskData);
      await fetchTasks();
      return { success: true, data: response.data.task };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const deleteTask = async (id) => {
    try {
      await tasksAPI.deleteTask(id);
      await fetchTasks();
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const fetchUsers = async (filters = {}) => {
    try {
      setUsersLoading(true);
      setError(null);
      const response = await usersAPI.getUsers(filters);
      setUsers(response.data.users);
      setUsersPagination(response.data.pagination);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setUsersLoading(false);
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      await usersAPI.updateUserRole(id, role);
      await fetchUsers();
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      setError(null);
      const response = await statsAPI.getOverviewStats();
      setStats(response.data);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setStatsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated,
    authLoading,
    login,
    register,
    logout,
    checkAuth,

    tasks,
    tasksLoading,
    tasksPagination,
    fetchTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,

    users,
    usersLoading,
    usersPagination,
    fetchUsers,
    updateUserRole,

    stats,
    statsLoading,
    fetchStats,

    error,
    clearError,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}