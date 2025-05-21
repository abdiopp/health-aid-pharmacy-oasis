import React, { createContext, useContext, useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string; // Adding timestamp for consistency with old code
}

interface ChatbotContextType {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean; // Added loading state
  error: string; // Added error state
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  addMessage: (message: string, role: "user" | "assistant") => void;
  sendMessage: (message: string, email: string) => Promise<void>;
  setMessages: (messages: Message[]) => void;
  fetchChatHistory: (email: string) => Promise<void>; // Added function to fetch chat history
  setIsLoading: (loading: boolean) => void; // Added to control loading state
  setError: (error: string) => void; // Added to control error state
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};

const MAX_MESSAGE_LENGTH = 200; // Maximum characters allowed in a message

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm MediBot, your medical assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen((prev) => !prev);

  const addMessage = (content: string, role: "user" | "assistant") => {
    setMessages((prev) => [
      ...prev,
      {
        role,
        content,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const fetchChatHistory = async (email: string) => {
    if (!email) return;

    setIsLoading(true);
    try {
      console.log("Fetching chat history for:", email);
      const response = await fetch("http://localhost:3003/chat/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        cache: "no-cache",
      });

      if (!response.ok) {
        console.error(
          "Server response not OK:",
          response.status,
          response.statusText
        );
        // Handle specific error codes
        if (response.status === 401) {
          throw new Error(
            "Authentication required. Please make sure you're logged in and try again."
          );
        } else {
          throw new Error(
            `Server returned ${response.status}: ${response.statusText}`
          );
        }
      }

      const data = await response.json();
      console.log("Data received from server:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.history) {
        console.log("Chat history loaded:", data.history.length, "messages");
        setMessages(
          data.history.map((msg: any) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.content,
            timestamp: msg.timestamp,
          }))
        );
      }
    } catch (error: any) {
      console.error("Error fetching chat history:", error);
      setMessages([
        {
          role: "assistant",
          content: `There was an error connecting to the chat service: ${
            error.message || "Unknown error"
          }. Please check that the server is running and refresh the page.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message: string, email: string) => {
    if (!message.trim() || !email) return;
    if (message.length > MAX_MESSAGE_LENGTH) {
      setError(
        `Message is too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.`
      );
      return;
    }

    // Add user message
    addMessage(message, "user");
    setIsLoading(true);

    try {
      console.log("Sending message to API:", message);
      const response = await fetch("http://localhost:3003/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          message: message.trim(),
        }),
        cache: "no-cache",
      });

      if (!response.ok) {
        console.error(
          "Server error response:",
          response.status,
          response.statusText
        );
        // Handle specific error codes
        if (response.status === 401) {
          throw new Error(
            "Authentication required. Please make sure you're logged in and try again."
          );
        } else {
          throw new Error(
            `Server returned ${response.status}: ${response.statusText}`
          );
        }
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      console.log("Received response from API:", data);

      if (data.response) {
        // If server returns full history, use that
        if (data.history && data.history.length > 0) {
          setMessages(
            data.history.map((msg: any) => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.content,
              timestamp: msg.timestamp || new Date().toISOString(),
            }))
          );
        } else {
          // Otherwise, add the AI response
          addMessage(data.response, "assistant");
        }
      } else {
        throw new Error("No response content from server");
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      addMessage(
        `Error: ${
          error.message || "Could not connect to the server. Please try again."
        }`,
        "assistant"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        messages,
        isLoading,
        error,
        openChat,
        closeChat,
        toggleChat,
        addMessage,
        sendMessage,
        setMessages,
        fetchChatHistory,
        setIsLoading,
        setError,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};
