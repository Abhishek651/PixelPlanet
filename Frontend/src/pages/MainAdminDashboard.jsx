import React, { useState } from 'react';
import UserManagement from '../components/UserManagement';
import AdminManagement from '../components/AdminManagement';
import SiteSettings from '../components/SiteSettings';

function MainAdminDashboard() {
  const [activeSection, setActiveSection] = useState('users');

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveSection('users')}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg font-medium transition-colors text-sm md:text-base ${
              activeSection === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveSection('admins')}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg font-medium transition-colors text-sm md:text-base ${
              activeSection === 'admins'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Admins
          </button>
          <button
            onClick={() => setActiveSection('settings')}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg font-medium transition-colors text-sm md:text-base ${
              activeSection === 'settings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {activeSection === 'users' && <UserManagement />}
      {activeSection === 'admins' && <AdminManagement />}
      {activeSection === 'settings' && <SiteSettings />}
    </div>
  );
}

export default MainAdminDashboard;
