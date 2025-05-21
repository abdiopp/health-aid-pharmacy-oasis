
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send } from 'lucide-react';
import { useChatbot } from '@/contexts/ChatbotContext';

const Chatbot: React.FC = () => {
  const { isOpen, messages, toggleChat, sendMessage } = useChatbot();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when messages change or chat opens
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg text-white z-40 ${
          isOpen ? 'bg-pharmacy-accent hover:bg-pharmacy-accent/90' : 'bg-pharmacy-blue hover:bg-pharmacy-blue/90'
        }`}
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-40 flex flex-col max-h-[70vh] animate-slide-in">
          {/* Chat Header */}
          <div className="p-4 bg-pharmacy-blue text-white rounded-t-lg">
            <h3 className="font-bold">MediBot Assistant</h3>
            <p className="text-xs">Ask me about medications and health</p>
          </div>

          {/* Messages */}
          <div className="p-4 overflow-y-auto flex-grow">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 max-w-[80%] ${
                  msg.role === 'user' ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-pharmacy-blue text-white rounded-br-none'
                      : 'bg-gray-100 text-pharmacy-text rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
