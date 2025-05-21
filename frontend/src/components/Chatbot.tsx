import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";
import { useChatbot } from "@/contexts/ChatbotContext";

const MAX_MESSAGE_LENGTH = 200; // Maximum characters allowed in a message

interface ChatbotProps {
  email: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ email }) => {
  const {
    isOpen,
    messages,
    isLoading,
    error: contextError,
    toggleChat,
    sendMessage,
    fetchChatHistory,
    setError,
  } = useChatbot();

  const [inputMessage, setInputMessage] = useState<string>("");
  const [localError, setLocalError] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch chat history on mount if email is provided
  useEffect(() => {
    if (email) {
      fetchChatHistory(email);
    }
  }, [email]);

  // Scroll to bottom of messages when messages change or chat opens
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_MESSAGE_LENGTH) {
      setInputMessage(text);
      setLocalError("");
      setError("");
    } else {
      setInputMessage(text.substring(0, MAX_MESSAGE_LENGTH));
      setLocalError(`Message is limited to ${MAX_MESSAGE_LENGTH} characters.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputMessage.trim() || !email) return;

    if (inputMessage.length > MAX_MESSAGE_LENGTH) {
      setLocalError(
        `Message is too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.`
      );
      return;
    }

    await sendMessage(inputMessage, email);
    setInputMessage("");

    // Focus back on input after sending
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg text-white z-40 ${
          isOpen
            ? "bg-pharmacy-accent hover:bg-pharmacy-accent/90"
            : "bg-pharmacy-blue hover:bg-pharmacy-blue/90"
        }`}
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
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
            {messages.length === 0 && !isLoading ? (
              <div className="text-center text-black/50 p-3">
                <p>Welcome to MediBot Assistant</p>
                <small>
                  Ask any questions about medications, health advice, or
                  pharmacy services.
                </small>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-3 max-w-[80%] ${
                      msg.role === "user" ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg ${
                        msg.role === "user"
                          ? "bg-pharmacy-blue text-white rounded-br-none"
                          : "bg-gray-100 text-pharmacy-text rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                      {msg.timestamp && (
                        <div className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="mb-3 max-w-[80%] mr-auto">
                    <div className="p-3 rounded-lg bg-gray-100 text-pharmacy-text rounded-bl-none">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-gray-200"
          >
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                type="text"
                placeholder={
                  email ? "Type your message..." : "Please log in to chat..."
                }
                value={inputMessage}
                onChange={handleInputChange}
                className="flex-grow"
                disabled={!email || isLoading}
                maxLength={MAX_MESSAGE_LENGTH}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!email || !inputMessage.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center mt-2">
              <small
                className={`text-sm ${
                  inputMessage.length > MAX_MESSAGE_LENGTH * 0.8
                    ? "text-yellow-500"
                    : "text-gray-500"
                }`}
              >
                {inputMessage.length}/{MAX_MESSAGE_LENGTH} characters
              </small>
              {contextError || localError ? (
                <small className="text-red-500">
                  {contextError || localError}
                </small>
              ) : null}
            </div>
            {!email && (
              <small className="text-red-500 block mt-1">
                Please log in to use the chat.
              </small>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
