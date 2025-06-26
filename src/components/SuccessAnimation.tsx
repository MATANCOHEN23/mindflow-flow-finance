
import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SuccessAnimationProps {
  message: string;
  onComplete: () => void;
}

export function SuccessAnimation({ message, onComplete }: SuccessAnimationProps) {
  useEffect(() => {
    // Import confetti dynamically
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    });

    // Auto close after 3 seconds
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
    >
      <div className="premium-card p-8 text-center">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 0.5 }}
          className="text-6xl mb-4"
        >
          ✅
        </motion.div>
        <h2 className="text-2xl font-bold mb-2 glow-text">מעולה!</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </motion.div>
  );
}
