import React, { useState, useEffect } from 'react';

const ModernStatCard = ({ icon, label, value, change, trend, color = 'emerald', delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  // Animated counter
  useEffect(() => {
    const duration = 1000; // 1 second
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);

  const colorClasses = {
    emerald: 'from-emerald-500 to-teal-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-amber-500'
  };

  const bgColors = {
    emerald: 'bg-emerald-50',
    blue: 'bg-blue-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50'
  };

  return (
    <div 
      className="stat-card animate-slide-up"
      style={{ 
        animationDelay: `${delay}ms`,
        '--gradient-color': `linear-gradient(90deg, var(--color-${color}-500), var(--color-teal-500))`
      }}
    >
      {/* Icon with gradient background */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} ${bgColors[color]} bg-opacity-20`}>
          <span className="text-3xl">{icon}</span>
        </div>
        
        {/* Trend indicator */}
        {change && (
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            trend === 'up' 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {trend === 'up' ? '↗' : '↘'}
            <span>{change}%</span>
          </div>
        )}
      </div>

      {/* Value with animated counter */}
      <div className="space-y-1">
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
          {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
        </h3>
        <p className="text-sm font-medium text-slate-500">{label}</p>
      </div>

      {/* Decorative gradient line */}
      <div className={`mt-4 h-1 rounded-full bg-gradient-to-r ${colorClasses[color]} opacity-20`}></div>
    </div>
  );
};

export default ModernStatCard;
