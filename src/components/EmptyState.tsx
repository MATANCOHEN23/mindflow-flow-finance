
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-6xl mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-2xl font-bold mb-2 glow-text">{title}</h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">{description}</p>
      {action && (
        <button className="btn-premium" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
