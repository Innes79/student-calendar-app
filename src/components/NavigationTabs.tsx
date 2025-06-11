
import React from 'react';
import { TabType } from '@/types';

interface NavigationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200 w-fit">
      <button
        onClick={() => onTabChange('dashboard')}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          activeTab === 'dashboard'
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        📊 Dashboard
      </button>
      <button
        onClick={() => onTabChange('calendar')}
        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          activeTab === 'calendar'
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        📅 Calendar
      </button>
    </div>
  );
};
