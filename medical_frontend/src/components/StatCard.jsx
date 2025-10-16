import React from 'react';

const StatCard = ({ title, value, icon, trend, trendValue, color = 'emerald' }) => {
  const colorClasses = {
    emerald: 'from-emerald-500 to-teal-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
  };

  const bgColorClasses = {
    emerald: 'bg-emerald-50',
    blue: 'bg-blue-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-105">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{value}</h3>
          {trend && (
            <div className="flex items-center space-x-1">
              <span className={`text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? '↑' : '↓'} {trendValue}
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white text-3xl shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
