import React, { useEffect, useState } from 'react';
import {
  Users as UsersIcon,
  Search,
  Crown,
  User,
  Calendar,
  Mail,
  AlertCircle
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const UsersPage = () => {
  const {
    users,
    usersLoading,
    usersPagination,
    fetchUsers,
    updateUserRole,
    user,
    error,
    clearError
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10
  });
  const [roleDialog, setRoleDialog] = useState({ open: false, user: null, newRole: '' });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchUsers(filters);
  }, [filters]);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const openRoleDialog = (userToUpdate) => {
    if (userToUpdate._id === user._id) {
      return; 
    }
    setRoleDialog({
      open: true,
      user: userToUpdate,
      newRole: userToUpdate.role
    });
  };

  const closeRoleDialog = () => {
    setRoleDialog({ open: false, user: null, newRole: '' });
  };

  const handleRoleUpdate = async () => {
    if (!roleDialog.user || !roleDialog.newRole) return;

    setUpdateLoading(true);
    const result = await updateUserRole(roleDialog.user._id, roleDialog.newRole);
    setUpdateLoading(false);

    if (result.success) {
      closeRoleDialog();
    }
  };

  const getRoleBadgeColor = (role) => {
    return role === 'admin'
      ? 'bg-purple-50 text-purple-700 border-purple-400'
      : 'bg-blue-50 text-blue-700 border-blue-400';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user accounts and permissions
          </p>
        </div>
        <div className='flex gap-2'>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Users List */}

      {usersLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'No users available'}
          </p>
        </div>
      ) : (
        <div className='border rounded-xl overflow-hidden'>
          <Table className="w-full">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-12">
                  Avatar
                </TableHead>
                <TableHead className="w-48">
                  Name
                </TableHead>
                <TableHead className="w-64">
                  Email
                </TableHead>
                <TableHead className="w-32">
                  Join Date
                </TableHead>
                <TableHead className="w-24">
                  Role
                </TableHead>
                <TableHead className="w-32">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((userItem) => (
                <TableRow key={userItem._id} className="hover:bg-muted/50">
                  <TableCell className="py-2 w-10">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {getInitials(userItem.name)}
                    </div>
                  </TableCell>

                  <TableCell className="w-48 max-w-48">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white truncate">
                        {userItem.name}
                      </span>
                      {userItem._id === user._id && (
                        <Badge variant="outline" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="w-64 max-w-64">
                    <div className="flex items-center text-gray-500">
                      <Mail className="h-4 w-4 mr-2" />
                      <span className="truncate text-sm" title={userItem.email}>
                        {userItem.email}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="w-32">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {formatDate(userItem.createdAt)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="w-24">
                    <Badge className={getRoleBadgeColor(userItem.role)} variant="secondary">
                      {userItem.role === 'admin' ? (
                        <Crown className="h-3 w-3 mr-1" />
                      ) : (
                        <User className="h-3 w-3 mr-1" />
                      )}
                      {userItem.role}
                    </Badge>
                  </TableCell>

                  <TableCell className="w-32">
                    {userItem._id !== user._id && (
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        size="sm"
                        onClick={() => openRoleDialog(userItem)}
                      >
                        Change Role
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {usersPagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={usersPagination.currentPage === 1}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-600">
            Page {usersPagination.currentPage} of {usersPagination.totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={usersPagination.currentPage === usersPagination.totalPages}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next
          </Button>
        </div>
      )}
      {/* Role Update Dialog */}
      <Dialog open={roleDialog.open} onOpenChange={closeRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
            <DialogDescription>
              Change the role for {roleDialog.user?.name}. This will affect their permissions in the system.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">

            <div className='space-y-2'>
              <Label>New Role</Label>
              <Select
                value={roleDialog.newRole}
                onValueChange={(value) => setRoleDialog(prev => ({ ...prev, newRole: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Member
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center">
                      <Crown className="h-4 w-4 mr-2" />
                      Admin
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm">
              <p className="font-medium mb-1">Role Permissions:</p>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                {roleDialog.newRole === 'admin' ? (
                  <>
                    <li>• Can view and manage all tasks</li>
                    <li>• Can assign tasks to any user</li>
                    <li>• Can manage user accounts and roles</li>
                    <li>• Can view system-wide statistics</li>
                  </>
                ) : (
                  <>
                    <li>• Can view and manage own tasks</li>
                    <li>• Can view assigned tasks from others</li>
                    <li>• Can view personal statistics</li>
                    <li>• Cannot manage other users</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={closeRoleDialog}>
              Cancel
            </Button>
            <Button
              variant="blue_btn"
              onClick={handleRoleUpdate}
              disabled={updateLoading || roleDialog.newRole === roleDialog.user?.role}
            >
              {updateLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Role'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;