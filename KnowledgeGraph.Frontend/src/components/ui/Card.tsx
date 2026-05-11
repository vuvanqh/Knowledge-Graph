import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import './ui.css';

export interface CardProps extends HTMLMotionProps<'div'> {
  glass?: boolean;
  glow?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

export function Card({ className = '', glass = false, glow = false, children, ref, ...props }: CardProps) {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`card-base ${glass ? 'glass-panel' : ''} ${glow ? 'card-glow' : ''} ${className}`}
      {...props}
      >
      {children}
    </motion.div>
  );
}
