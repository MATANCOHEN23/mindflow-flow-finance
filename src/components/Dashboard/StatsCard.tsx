
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
    <div className={`flyer-card shine-effect hover-scale transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="stats-icon">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-2 text-base font-black px-4 py-2 rounded-full border-3 ${
            trend.isPositive 
              ? 'trend-positive' 
              : 'trend-negative'
          }`}>
            <span className="text-2xl">{trend.isPositive ? '📈' : '📉'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-4xl font-black text-cream mb-3 text-shadow-lg">{value}</h3>
        <p className="text-cream/90 text-lg font-bold text-shadow">{title}</p>
      </div>
    </div>
  );
}
