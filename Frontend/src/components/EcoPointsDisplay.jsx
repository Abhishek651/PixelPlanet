import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const sizeVariants = {
  small: {
    text: 'text-sm',
    icon: 'w-4 h-4',
  },
  medium: {
    text: 'text-lg',
    icon: 'w-5 h-5',
  },
  large: {
    text: 'text-2xl',
    icon: 'w-6 h-6',
  },
};

export default function EcoPointsDisplay({ 
  points = 0, 
  size = 'medium', 
  showLabel = true, 
  animate = true,
  className = ''
}) {
  const [count, setCount] = useState(animate ? 0 : points);
  const { text: textSize, icon: iconSize } = sizeVariants[size] || sizeVariants.medium;

  useEffect(() => {
    if (animate) {
      const duration = 1500; // 1.5 seconds
      const steps = 60; // 60 steps for smooth animation
      const increment = points / steps;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        setCount(prev => {
          const next = currentStep < steps ? prev + increment : points;
          return Math.min(next, points);
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    } else {
      setCount(points);
    }
  }, [points, animate]);

  return (
    <div 
      className={`flex items-center gap-2 ${className}`}
      aria-label={`Eco Points: ${points}`}
    >
      <Leaf 
        className={`text-green-600 dark:text-green-400 ${iconSize}`} 
      />
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`${textSize} font-bold`}
      >
        {Math.round(count)}
      </motion.span>
      {showLabel && (
        <span className={`${textSize} font-semibold text-gray-600 dark:text-gray-300`}>
          Eco Points
        </span>
      )}
    </div>
  );
}