import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  icon = '📭', 
  title = 'No data found', 
  description = 'Get started by creating your first item',
  actionLabel,
  actionLink,
  onAction
}) => {
  return (
    <div className="card text-center py-16 animate-fade-in">
      {/* Icon */}
      <div className="mb-6 inline-block">
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center">
          <span className="text-5xl">{icon}</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-3">
          {title}
        </h3>
        <p className="text-slate-600 text-base leading-relaxed">
          {description}
        </p>
      </div>

      {/* Action Button */}
      {(actionLabel && (actionLink || onAction)) && (
        actionLink ? (
          <Link 
            to={actionLink}
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>✨</span>
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>✨</span>
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
