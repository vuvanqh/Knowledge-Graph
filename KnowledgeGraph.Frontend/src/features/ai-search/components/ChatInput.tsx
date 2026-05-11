import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  query: string;
  isTyping: boolean;
  onQueryChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ query, isTyping, onQueryChange, onSubmit }) => {
  return (
    <div className="input-area">
      <form onSubmit={onSubmit} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Ask a question..."
          className="query-input"
          disabled={isTyping}
        />
        <button type="submit" className="send-btn" disabled={!query.trim() || isTyping}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};
