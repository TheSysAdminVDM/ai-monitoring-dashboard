import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-space-dark border-b border-neon-blue/20 shadow-lg"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-neon-blue/10 border border-neon-blue/50 rounded-lg">
              <Zap className="w-8 h-8 text-neon-blue" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neon-blue glow-text">
                AI Monitoring Dashboard
              </h1>
              <p className="text-sm text-gray-400 font-mono">
                Real-time Token Usage Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-4 py-2 bg-neon-green/10 border border-neon-green/50 rounded-lg">
              <Activity className="w-4 h-4 text-neon-green animate-pulse" />
              <span className="text-sm font-mono text-neon-green">ONLINE</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
