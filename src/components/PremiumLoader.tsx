
interface PremiumLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PremiumLoader({ size = 'md', className = '' }: PremiumLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`premium-loader ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 border-4 border-transparent border-t-orange-500 rounded-full animate-spin"></div>
      <div className="absolute inset-2 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
    </div>
  );
}
