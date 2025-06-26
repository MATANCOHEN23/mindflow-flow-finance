
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon, trend, className = "" }: StatsCardProps) {
  return (
    <div className={`premium-card hover-scale transition-all duration-300 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="text-4xl">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-2 text-base font-black px-4 py-2 rounded-full border-2 ${
            trend.isPositive 
              ? 'bg-green-100 text-green-800 border-green-300' 
              : 'bg-red-100 text-red-800 border-red-300'
          }`}>
            <span className="text-2xl">{trend.isPositive ? '📈' : '📉'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-4xl font-black text-blue-600 mb-3 glow-text">{value}</h3>
        <p className="text-gray-700 text-lg font-bold">{title}</p>
      </div>
    </div>
  );
}
