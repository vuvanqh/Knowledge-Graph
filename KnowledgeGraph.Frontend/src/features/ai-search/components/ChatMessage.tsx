import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, FileText, Search as SearchIcon } from 'lucide-react';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  reasoning?: string[];
  citations?: { id: number; title: string; snippet: string }[];
}

interface ChatMessageProps {
  msg: Message;
  isLast: boolean;
}

const renderMessageContent = (content: string) => {
  const parts = content.split('```');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      const lines = part.split('\n');
      const lang = lines[0];
      const code = lines.slice(1).join('\n');
      return (
        <div key={index} className="mock-code-block">
          <div className="code-header">{lang || 'code'}</div>
          <pre><code>{code}</code></pre>
        </div>
      );
    }
    return (
      <div key={index} dangerouslySetInnerHTML={{ 
        __html: part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') 
      }} />
    );
  });
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ msg, isLast }) => {
  return (
    <motion.div 
      className={`message-wrapper ${msg.type}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: isLast ? 0 : 0 }}
    >
      <div className="message-avatar">
        {msg.type === 'user' ? <User size={20} /> : <Bot size={20} />}
      </div>
      <div className="message-content">
        {msg.type === 'user' ? (
          <div className="user-text">{msg.content}</div>
        ) : (
          <div className="ai-response">
            <div className="formatted-text">{renderMessageContent(msg.content)}</div>
            
            {msg.citations && msg.citations.length > 0 && (
              <div className="citations-block">
                <h4>Sources</h4>
                <div className="citation-chips">
                  {msg.citations.map(c => (
                    <div key={c.id} className="citation-chip">
                      <FileText size={12} /> [{c.id}] {c.title}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const TypingIndicator: React.FC<{ currentStep: string; streamingContent: string }> = ({ currentStep, streamingContent }) => {
  return (
    <motion.div 
      className="message-wrapper ai"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="message-avatar pulse-avatar"><Bot size={20} /></div>
      <div className="message-content">
        <AnimatePresence mode="wait">
          {currentStep && (
            <motion.div 
              key="step"
              className="reasoning-step"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <SearchIcon size={14} className="spin-slow" />
              <span>{currentStep}</span>
            </motion.div>
          )}
        </AnimatePresence>
        {streamingContent && (
          <div className="formatted-text">{renderMessageContent(streamingContent)}</div>
        )}
      </div>
    </motion.div>
  );
};
