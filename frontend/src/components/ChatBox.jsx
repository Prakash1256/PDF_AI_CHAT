import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';

const ChatBox = ({ pdfFile }) => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleChatSubmit = async (e) => {
    e?.preventDefault();
    if (chatInput.trim()) {
      const userMessage = { text: chatInput, type: 'user', timestamp: new Date() };
      setMessages(prev => [...prev, userMessage]);
      setLoading(true);
      setChatInput('');

      try {
        const response = await axios.post('http://localhost:5000/api/chat', { 
          question: chatInput,
          pdfFile: pdfFile 
        }); 

        console.log("this is the response" , response);
        
        const botMessage = {
          text: response.data.answer || response.data.message || 'I received your question and processed it successfully.',
          type: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setLoading(false);

      } catch (error) {
        console.error('API Error:', error);
        const errorMessage = {
          text: 'Sorry, I encountered an error while processing your question. Please try again.',
          type: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        setLoading(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setChatInput(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-0 lg:border-l lg:border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center space-x-3">
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg">Your document is ready!</h3>
            <p className="text-purple-100 text-xs sm:text-sm">You can now ask questions about your document. For example:</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 space-y-3 sm:space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="space-y-3 sm:space-y-4">
            <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-100">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-xs font-medium">•</span>
                  </div>
                  <button 
                    onClick={() => handleSuggestionClick("What is the main topic of this document?")}
                    className="text-purple-600 hover:text-purple-800 text-left transition-colors cursor-pointer text-sm sm:text-base"
                  >
                    "What is the main topic of this document?"
                  </button>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-xs font-medium">•</span>
                  </div>
                  <button 
                    onClick={() => handleSuggestionClick("Can you summarize the key points?")}
                    className="text-purple-600 hover:text-purple-800 text-left transition-colors cursor-pointer text-sm sm:text-base"
                  >
                    "Can you summarize the key points?"
                  </button>
                </div>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-xs font-medium">•</span>
                  </div>
                  <button 
                    onClick={() => handleSuggestionClick("What are the conclusions or recommendations?")}
                    className="text-purple-600 hover:text-purple-800 text-left transition-colors cursor-pointer text-sm sm:text-base"
                  >
                    "What are the conclusions or recommendations?"
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs sm:max-w-sm lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
              msg.type === 'user' 
                ? 'bg-purple-500 text-white rounded-br-md' 
                : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
            }`}>
              <p className="text-xs sm:text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500">AI is analyzing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 bg-white px-3 sm:px-6 py-3 sm:py-4">
        <div className="relative">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 text-sm"
            placeholder="Ask about the document..."
            disabled={loading}
          />
          <button
            onClick={handleChatSubmit}
            disabled={loading || !chatInput.trim()}
            className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-purple-500 text-white rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;