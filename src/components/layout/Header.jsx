import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';

const Header = ({ setSidebarOpen }) => {
  const { user, stats } = useApp();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            {stats.overdueTasks > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute top-1 right-2 h-3 w-3 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {stats.overdueTasks > 9 ? '9+' : stats.overdueTasks}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;