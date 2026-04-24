import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, User, Bot, ArrowRight } from 'lucide-react';
import { useSettings, translations } from '../hooks/useSettings';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
  action?: string;
}

interface ChatInterfaceProps {
  onNavigate: (section: any) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onNavigate }) => {
  const { language } = useSettings();
  const t = translations[language];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: language === 'hi' ? 
        "नमस्ते! मैं राईट इलेक्ट हूँ, आपका बुद्धिमान चुनाव सहायक। आज मैं आपकी लोकतांत्रिक प्रक्रिया में भाग लेने में कैसे मदद कर सकता हूँ?" : 
        "Namaste! I am Right Elect, your intelligent election assistant. How can I help you participate in the democratic process today?",
      sender: 'assistant',
      timestamp: new Date(),
      suggestions: ["Am I eligible to vote?", "How do I register?", "Voting Simulation", "Election Dates"]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const startVoiceCapture = () => {
    if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      processQuery(text);
    }, 1000);
  };

  const processQuery = (query: string) => {
    const q = query.toLowerCase();
    let responseText = "";
    let suggestions: string[] = [];

    if (q.includes('eligible') || q.includes('can i vote')) {
      responseText = "Voting eligibility is key! In India, you must be a citizen, 18+ years old, and registered in the electoral roll. Would you like to check your specific eligibility now?";
      suggestions = ["Start Eligibility Test", "Register to Vote", "Other requirements"];
    } else if (q.includes('register') || q.includes('how to join')) {
      responseText = "Registration is simple. You can apply online via the Voter Portal or offline at the BLO office. Are you a first-time voter?";
      suggestions = ["I'm a new voter", "Shifted residence", "Check my status"];
    } else if (q.includes('simulate') || q.includes('voting booth') || q.includes('how to vote')) {
      responseText = "I can take you through a virtual voting booth. You'll see how the EVM and VVPAT work step-by-step!";
      suggestions = ["Start Simulation", "What is EVM?", "Polling booth rules"];
    } else if (q.includes('timeline') || q.includes('stages') || q.includes('process')) {
      responseText = "Elections happen in 6 main stages: from Announcement to Results. I can show you the interactive timeline!";
      suggestions = ["Show Timeline", "Upcoming dates", "What is nominations?"];
    } else {
      responseText = "That's a great question. As a neutral assistant, I can help you with registration details, eligibility status, or explain how the voting process works. Which of these sounds most helpful?";
      suggestions = ["Eligibility Checker", "Registration Guide", "Voting Simulation"];
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: responseText,
      sender: 'assistant',
      timestamp: new Date(),
      suggestions
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMessage]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === "Start Eligibility Test" || suggestion === "Eligibility Checker") {
       onNavigate('eligibility');
    } else if (suggestion === "Show Timeline") {
       onNavigate('info');
    } else if (suggestion === "Start Simulation" || suggestion === "Voting Simulation") {
       onNavigate('simulator');
    } else if (suggestion === "Election Dates" || suggestion === "Check my status") {
       onNavigate('profile');
    } else {
       handleSend(suggestion);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-list scroll-hide">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`message-wrapper ${msg.sender}`}
          >
            <div className="avatar">
              {msg.sender === 'assistant' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className="message-bubble glass-card">
              <p>{msg.text}</p>
              {msg.suggestions && (
                <div className="suggestions">
                  {msg.suggestions.map((s, i) => (
                    <button 
                      key={i} 
                      className="suggestion-chip"
                      onClick={() => handleSuggestionClick(s)}
                    >
                      {s} <ArrowRight size={12} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="message-wrapper assistant">
            <div className="avatar"><Bot size={20} /></div>
            <div className="typing-indicator glass-card">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area glass-card">
        <button 
          className={`icon-btn voice ${isListening ? 'voice-pulse' : ''}`} 
          onClick={startVoiceCapture}
        >
          <Mic size={20} />
        </button>
        <input 
          type="text" 
          placeholder={t.askPlaceholder} 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
        />
        <button className="send-btn" onClick={() => handleSend(inputValue)}>
          <Send size={20} />
        </button>
      </div>

      <style>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: var(--spacing-sm);
        }
        .messages-list {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          padding-bottom: var(--spacing-md);
        }
        .message-wrapper {
          display: flex;
          gap: 12px;
          max-width: 90%;
        }
        .message-wrapper.user {
          flex-direction: row-reverse;
          align-self: flex-end;
        }
        .avatar {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--surface-border);
          flex-shrink: 0;
        }
        .message-wrapper.assistant .avatar {
          color: var(--primary);
        }
        .message-bubble {
          padding: 14px 18px;
          border-radius: 20px;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        .message-wrapper.user .message-bubble {
          background: var(--primary);
          color: white;
          border: none;
          border-bottom-right-radius: 4px;
        }
        .message-wrapper.assistant .message-bubble {
          border-bottom-left-radius: 4px;
          color: var(--text-main);
        }
        .suggestions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
        }
        .suggestion-chip {
          background: var(--background);
          border: 1px solid var(--surface-border);
          color: var(--primary);
          padding: 8px 14px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .suggestion-chip:hover {
          transform: translateY(-1px);
          border-color: var(--primary);
          background: var(--primary-glow);
        }
        .input-area {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          gap: 12px;
          margin-top: auto;
          border-radius: 20px;
          background: var(--surface);
          border: 1px solid var(--surface-border);
        }
        .input-area input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-main);
          outline: none;
          padding: 8px;
          font-family: inherit;
          font-size: 0.95rem;
        }
        .input-area input::placeholder {
           color: var(--text-muted);
           opacity: 0.7;
        }
        .send-btn {
          background: var(--primary);
          color: white;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .send-btn:active { transform: scale(0.9); }
        
        .icon-btn.voice {
          color: var(--text-muted);
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 10px;
          transition: all 0.2s;
        }
        
        .typing-indicator {
          padding: 12px 16px;
          display: flex;
          gap: 4px;
          border-radius: 16px;
        }
        .typing-indicator span {
          width: 6px;
          height: 6px;
          background: var(--text-muted);
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        .scroll-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ChatInterface;
