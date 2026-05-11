import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Card } from '../../../components/ui';

interface ContextSidebarProps {
  isTyping: boolean;
  hasMessages: boolean;
  isLastMessageAi: boolean;
}

export const ContextSidebar: React.FC<ContextSidebarProps> = ({ isTyping, hasMessages, isLastMessageAi }) => {
  return (
    <Card glass className="chat-sidebar">
      <div className="sidebar-header">
        <h3>Retrieval Context</h3>
      </div>
      
      <div className="context-list">
        {!isTyping && !hasMessages && (
          <div className="context-empty">Context will appear here when you search.</div>
        )}
        
        <AnimatePresence>
          {hasMessages && isLastMessageAi && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="context-card">
                <div className="context-card-header">
                  <CheckCircle size={14} color="var(--ds-success)" />
                  <span>Document Match</span>
                </div>
                <h4>Architecture.md</h4>
                <p className="context-snippet">...system uses a microservices architecture with a clear separation of concerns. The API Gateway routes requests to specific services...</p>
                <div className="similarity-bar">
                  <motion.div className="fill" initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1 }}></motion.div>
                </div>
                <span className="similarity-score">92% relevance</span>
              </div>

              <div className="context-card" style={{ marginTop: 16 }}>
                <div className="context-card-header">
                  <CheckCircle size={14} color="var(--ds-success)" />
                  <span>Graph Node Match</span>
                </div>
                <h4>Concept: Microservices</h4>
                <p className="context-snippet">Connected to: API Gateway, Vector DB, RabbitMQ</p>
                <div className="similarity-bar">
                  <motion.div className="fill" initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1, delay: 0.2 }}></motion.div>
                </div>
                <span className="similarity-score">85% relevance</span>
              </div>
            </motion.div>
          )}
          
          {isTyping && (
            <motion.div 
              className="context-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};
