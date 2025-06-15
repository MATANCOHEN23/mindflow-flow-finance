
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
    <div className={`premium-card card-hover shine-effect group ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="text-4xl p-3 bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl border-2 border-goldBorder/50 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-2 text-sm font-bold px-3 py-1 rounded-full border-2 ${
            trend.isPositive 
              ? 'text-success bg-success/10 border-success/30' 
              : 'text-danger bg-danger/10 border-danger/30'
          }`}>
            <span className="text-lg">{trend.isPositive ? '↗' : '↘'}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-black gradient-text mb-2">{value}</h3>
        <p className="text-primary/70 text-base font-semibold">{title}</p>
      </div>
    </div>
  );
}
