import React from 'react';

export const StatCardSkeleton = () => (
  <div className="stat-card animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="w-14 h-14 skeleton rounded-xl"></div>
      <div className="w-16 h-6 skeleton rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="h-8 w-24 skeleton rounded"></div>
      <div className="h-4 w-32 skeleton rounded"></div>
    </div>
    <div className="mt-4 h-1 skeleton rounded-full"></div>
  </div>
);

export const AppointmentCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-14 h-14 skeleton rounded-xl"></div>
      <div className="flex-1 space-y-2">
        <div className="h-5 w-32 skeleton rounded"></div>
        <div className="h-4 w-24 skeleton rounded"></div>
      </div>
      <div className="w-20 h-6 skeleton rounded-full"></div>
    </div>
    <div className="space-y-3 mb-4">
      <div className="h-4 w-full skeleton rounded"></div>
      <div className="h-4 w-3/4 skeleton rounded"></div>
      <div className="h-4 w-1/2 skeleton rounded"></div>
    </div>
    <div className="flex gap-2 pt-4 border-t border-slate-100">
      <div className="flex-1 h-10 skeleton rounded-lg"></div>
      <div className="w-28 h-10 skeleton rounded-lg"></div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <div className="h-4 w-24 skeleton rounded"></div>
    </td>
    <td className="px-6 py-4">
      <div className="space-y-1">
        <div className="h-4 w-32 skeleton rounded"></div>
        <div className="h-3 w-24 skeleton rounded"></div>
      </div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-20 skeleton rounded"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-6 w-20 skeleton rounded-full"></div>
    </td>
    <td className="px-6 py-4">
      <div className="h-4 w-16 skeleton rounded"></div>
    </td>
  </tr>
);

const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const skeletons = {
    stat: StatCardSkeleton,
    appointment: AppointmentCardSkeleton,
    table: TableRowSkeleton,
  };

  const SkeletonComponent = skeletons[type] || StatCardSkeleton;

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </>
  );
};

export default LoadingSkeleton;
