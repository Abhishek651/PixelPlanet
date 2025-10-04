
import React from 'react';
import SiteSettings from '../components/SiteSettings';

function MainAdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Main Admin Dashboard</h1>
        <SiteSettings />
      </div>
    </div>
  );
}

export default MainAdminDashboard;
