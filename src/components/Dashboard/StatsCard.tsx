
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
    <div className={`bg-white gold-border rounded-xl p-6 card-shadow card-hover ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend.isPositive ? 'text-success' : 'text-danger'
          }`}>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-primary mb-1">{value}</h3>
        <p className="text-muted-foreground text-sm">{title}</p>
      </div>
    </div>
  );
}
