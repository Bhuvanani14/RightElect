import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, User, Bot, ArrowRight, Volume2, Sparkles } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: string[];
  isAi?: boolean;
}

interface ChatInterfaceProps {
  onNavigate: (section: any) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onNavigate }) => {
  const { language } = useSettings();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: language === 'hi' ? 
        "नमस्ते! मैं राईट इलेक्ट एआई हूँ। मैं आपको भारत के चुनाव, मतदान प्रक्रिया और आपके अधिकारों के बारे में जानकारी दे सकता हूँ। आप क्या जानना चाहेंगे?" : 
        "Namaste! I am Right Elect AI. I can guide you through Indian elections, voting processes, and your rights. What would you like to know today?",
      sender: 'assistant',
      timestamp: new Date(),
      suggestions: ["Am I eligible to vote?", "How to register?", "Scan Voter ID", "Take Quiz", "Voting Simulation"],
      isAi: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceCapture = () => {
    if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      handleSend(transcript);
    };
    recognition.start();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const newMessage: Message = { id: Date.now().toString(), text, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      processAiQuery(text);
    }, 1500);
  };

  const processAiQuery = async (query: string) => {
    const q = query.toLowerCase();
    let responseText = "";
    let suggestions: string[] = [];

    // Simulate Gemini Pro / Vertex AI response logic
    if (q.includes('scan') || q.includes('ocr') || q.includes('verify')) {
      responseText = "I've detected you want to verify a Voter ID. You can use our AI-powered OCR tool to extract and verify EPIC details instantly.";
      suggestions = ["Open Voter ID Scanner", "How does OCR work?"];
    } else if (q.includes('quiz') || q.includes('test') || q.includes('know')) {
      responseText = "Let's test your Democracy IQ! I can open the interactive quiz for you where you can earn badges while learning about the constitution.";
      suggestions = ["Start Quiz Now", "What is Democracy IQ?"];
    } else if (q.includes('eligible') || q.includes('can i vote')) {
      responseText = "According to Article 326 of the Constitution, every citizen who is 18+ and not otherwise disqualified is entitled to be registered. Would you like to use our structured eligibility checker?";
      suggestions = ["Start Eligibility Test", "Check Voter List"];
    } else {
      // General Gemini-like broad response
      responseText = `As an Election Guide AI, I can confirm that ${query} is a valid topic. In India, the Election Commission ensures free and fair voting. To help you better, would you like to explore our specialized modules?`;
      suggestions = ["Voter Registration", "Booth Locator", "Latest Election News"];
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: responseText,
      sender: 'assistant',
      timestamp: new Date(),
      suggestions,
      isAi: true
    };

    setIsTyping(false);
    setMessages(prev => [...prev, botMessage]);
    // Auto-speak the AI response if needed (optional accessibility)
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion.includes("Scan") || suggestion.includes("Scanner")) onNavigate('ocr');
    else if (suggestion.includes("Quiz")) onNavigate('quiz');
    else if (suggestion.includes("Eligibility")) onNavigate('eligibility');
    else if (suggestion.includes("Simulation")) onNavigate('simulator');
    else if (suggestion.includes("Timeline")) onNavigate('info');
    else handleSend(suggestion);
  };

  return (
    <div className="chat-container">
      <div className="messages-list scroll-hide">
        {messages.map((msg) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`message-wrapper ${msg.sender}`}>
            <div className={`avatar ${msg.isAi ? 'ai-glow' : ''}`}>
              {msg.sender === 'assistant' ? (msg.isAi ? <Sparkles size={18} /> : <Bot size={20} />) : <User size={20} />}
            </div>
            <div className="message-bubble glass-card">
              <div className="msg-content">
                <p>{msg.text}</p>
                {msg.sender === 'assistant' && (
                  <button className="tts-btn" onClick={() => speak(msg.text)} title="Listen to message">
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
              {msg.suggestions && (
                <div className="suggestions">
                  {msg.suggestions.map((s, i) => (
                    <button key={i} className="suggestion-chip" onClick={() => handleSuggestionClick(s)}>
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
            <div className="avatar ai-glow"><Sparkles size={18} /></div>
            <div className="typing-indicator glass-card"><span></span><span></span><span></span></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area glass-card">
        <button className={`icon-btn voice ${isListening ? 'voice-pulse' : ''}`} onClick={startVoiceCapture}>
          <Mic size={20} />
        </button>
        <input 
          type="text" 
          placeholder="Ask Election Guide AI..." 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend(inputValue)}
        />
        <button className="send-btn" onClick={() => handleSend(inputValue)}>
          <Send size={20} />
        </button>
      </div>

      <style>{`
        .chat-container { display: flex; flex-direction: column; height: 100%; gap: var(--spacing-sm); }
        .messages-list { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: var(--spacing-md); }
        .message-wrapper { display: flex; gap: 12px; max-width: 90%; }
        .message-wrapper.user { flex-direction: row-reverse; align-self: flex-end; }
        .avatar { width: 38px; height: 38px; border-radius: 12px; background: var(--surface); display: flex; align-items: center; justify-content: center; border: 1px solid var(--surface-border); flex-shrink: 0; }
        .avatar.ai-glow { background: var(--primary-glow); color: var(--primary); box-shadow: 0 0 15px var(--primary-glow); }
        
        .message-bubble { padding: 14px 18px; border-radius: 20px; font-size: 0.95rem; line-height: 1.6; position: relative; }
        .msg-content { display: flex; gap: 10px; }
        .tts-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: 6px; align-self: flex-start; }
        .tts-btn:hover { color: var(--primary); background: var(--primary-glow); }
        
        .message-wrapper.user .message-bubble { background: var(--primary); color: white; border: none; }
        .message-wrapper.assistant .message-bubble { color: var(--text-main); }
        
        .suggestions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
        .suggestion-chip { background: var(--background); border: 1px solid var(--surface-border); color: var(--primary); padding: 8px 14px; border-radius: 12px; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
        
        .input-area { display: flex; align-items: center; padding: 10px 14px; gap: 12px; margin-top: auto; border-radius: 20px; background: var(--surface); border: 1px solid var(--surface-border); }
        .input-area input { flex: 1; background: transparent; border: none; color: var(--text-main); outline: none; padding: 8px; font-family: inherit; }
        .send-btn { background: var(--primary); color: white; border: none; width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default ChatInterface;
