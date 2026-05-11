import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';
import { Card } from '../components/ui';
import { useSearch } from '../hooks/useSearch';
import { ChatMessage, TypingIndicator, type Message } from '../features/ai-search/components/ChatMessage';
import { ChatInput } from '../features/ai-search/components/ChatInput';
import { ContextSidebar } from '../features/ai-search/components/ContextSidebar';

const AiSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [currentStep, setCurrentStep] = useState<string>('');
  
  const searchMutation = useSearch();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, currentStep]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), type: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsTyping(true);
    setStreamingContent('');
    
    setCurrentStep('Analyzing query semantics...');
    await new Promise(r => setTimeout(r, 600));
    
    setCurrentStep('Retrieving relevant graph nodes...');
    await new Promise(r => setTimeout(r, 800));
    
    setCurrentStep('Synthesizing answer...');
    
    const response = await searchMutation.mutateAsync(query);
    setCurrentStep('');

    const mockResponse = response.answer;

    for (let i = 0; i <= mockResponse.length; i++) {
      setStreamingContent(mockResponse.slice(0, i));
      await new Promise(r => setTimeout(r, 10));
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: mockResponse,
      reasoning: response.reasoning,
      citations: response.citations
    };

    setMessages(prev => [...prev, aiMessage]);
    setStreamingContent('');
    setIsTyping(false);
  };

  return (
    <div className="search-container">
      <motion.div 
        className="search-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-gradient">AI Knowledge Assistant</h1>
        <p>Ask anything about your documents and semantic graph</p>
      </motion.div>

      <div className="chat-layout">
        <motion.div 
          className="chat-main-wrapper"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card glass className="chat-main">
            <div className="messages-area">
              <AnimatePresence>
                {messages.length === 0 && !isTyping && (
                  <motion.div 
                    className="empty-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="empty-icon-wrapper">
                      <BrainCircuit size={48} />
                      <div className="empty-icon-glow" />
                    </div>
                    <h3>How can I help you today?</h3>
                    <p>Try asking about system architecture, specific documents, or graph concepts.</p>
                  </motion.div>
                )}

                {messages.map((msg, idx) => (
                  <ChatMessage key={msg.id} msg={msg} isLast={idx === messages.length - 1} />
                ))}

                {isTyping && (
                  <TypingIndicator currentStep={currentStep} streamingContent={streamingContent} />
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <ChatInput query={query} isTyping={isTyping} onQueryChange={setQuery} onSubmit={handleSearch} />
          </Card>
        </motion.div>

        <motion.div 
          className="chat-sidebar-wrapper"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ContextSidebar 
            isTyping={isTyping} 
            hasMessages={messages.length > 0} 
            isLastMessageAi={messages.length > 0 && messages[messages.length - 1].type === 'ai'} 
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AiSearch;
