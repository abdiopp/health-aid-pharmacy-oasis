
import React, { createContext, useContext, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotContextType {
  isOpen: boolean;
  messages: Message[];
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  addMessage: (message: string, role: 'user' | 'assistant') => void;
  sendMessage: (message: string) => Promise<void>;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m MediBot, your medical assistant. How can I help you today?' 
    }
  ]);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen(prev => !prev);

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    setMessages(prev => [...prev, { role, content }]);
  };

  const sendMessage = async (message: string) => {
    // Add user message
    addMessage(message, 'user');
    
    try {
      // This would normally be a call to a real AI service like Gemini
      // For demo, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let botResponse = '';
      
      // Simple keyword-based responses
      if (message.toLowerCase().includes('headache')) {
        botResponse = 'For headaches, make sure to stay hydrated and consider over-the-counter pain relievers like acetaminophen or ibuprofen. If headaches persist for more than a few days, please consult with a healthcare professional.';
      } 
      else if (message.toLowerCase().includes('cold') || message.toLowerCase().includes('flu')) {
        botResponse = 'For cold and flu symptoms, rest, stay hydrated, and consider over-the-counter medications for symptom relief. Antibiotics won\'t help with viral infections. If symptoms worsen or last more than a week, consult a doctor.';
      }
      else if (message.toLowerCase().includes('prescription') || message.toLowerCase().includes('refill')) {
        botResponse = 'For prescription refills, please use the refill request form on our website or call our pharmacy directly during business hours. Make sure to provide your prescription details and allow 24-48 hours for processing.';
      }
      else {
        botResponse = 'I understand your concern. While I can provide general information, it\'s always best to consult with a healthcare professional for personalized medical advice. Is there anything specific about medications or health conditions you\'d like to know?';
      }
      
      // Add bot response
      addMessage(botResponse, 'assistant');
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('Sorry, I encountered an error processing your request. Please try again later.', 'assistant');
    }
  };

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        messages,
        openChat,
        closeChat,
        toggleChat,
        addMessage,
        sendMessage,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};
