import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  AlertCircle,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { StudentProfile, GeneratedRoadmap, ChatMessage } from '../types';

interface MentorChatbotProps {
  profile: StudentProfile;
  roadmap: GeneratedRoadmap | null;
  onNavigate?: (tab: string) => void;
}

export const MentorChatbot: React.FC<MentorChatbotProps> = ({ profile, roadmap, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Craft an encouraging, context-aware initial welcome message
  const createInitialWelcome = (): string => {
    const studentName = profile.name ? profile.name.trim() : '';
    const greeting = studentName ? `Assalam-o-Alaikum, ${studentName}!` : 'Assalam-o-Alaikum!';

    if (roadmap) {
      const field = profile.targetField ? `for ${profile.targetField}` : '';
      return `${greeting} I'm your Waqfa AI Mentor. I have full context of your 12-month roadmap ${field}, your 7-day kickstart, and your study goals.\n\nAsk me why specific milestones were chosen, how to adjust your weekly study hours, or how to tackle entrance tests like NET, MDCAT, or FAST!`;
    }

    if (profile.qualification || profile.targetField) {
      return `${greeting} I'm your Waqfa AI Mentor. I see your Student Blueprint (${profile.qualification || 'Targeting University'}).\n\nOnce you click "Create My Roadmap", I can answer detailed questions about your schedule and milestones, or help you refine your goals right now!`;
    }

    return `${greeting} I'm your Waqfa AI Mentor. My guiding motto is "Pause, but with purpose."\n\nI can help you navigate your gap year in Pakistan, explore degree fields, understand entrance exam cycles (NET, MDCAT, ECAT, SAT), or guide you through creating your roadmap. What's on your mind?`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: createInitialWelcome(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Re-generate welcome message if roadmap or profile changes and no user messages yet
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'model') {
      setMessages([
        {
          id: 'welcome-updated',
          role: 'model',
          text: createInitialWelcome(),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [roadmap, profile]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Reset conversation handler
  const handleResetChat = () => {
    setErrorMessage(null);
    setInputMessage('');
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: createInitialWelcome(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    setErrorMessage(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, text: m.text })),
          profile,
          roadmap,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to connect to AI Mentor. Please try again.');
      }

      const mentorMsg: ChatMessage = {
        id: `mentor-${Date.now()}`,
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, mentorMsg]);
    } catch (err: any) {
      console.error('Mentor chat error:', err);
      setErrorMessage(
        err.message ||
          'Connection interrupted. Please ensure the dev server is active and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRetryLast = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.text);
    }
  };

  // Contextual starter prompts based on user state
  const quickPrompts = roadmap
    ? [
        'Why was this specific roadmap recommended for me?',
        'How should I balance test prep with skills?',
        'My weekly study hours changed. How do I adjust?',
        'Which free resources are best for my skills?',
      ]
    : profile.qualification || profile.targetField
      ? [
          'What should I prioritize before generating my plan?',
          'How do NUST NET and MDCAT test schedules work?',
          'How can I explain a gap year on university applications?',
        ]
      : [
          'How do I make the most of my gap year in Pakistan?',
          'What are the 4 series of NUST NET exams?',
          'How does the Student Blueprint help me plan?',
        ];

  const hasContext = !!(roadmap || profile.qualification || profile.targetField);

  return (
    <>
      {/* Floating Action Button (Fixed Bottom-Right) */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close Waqfa AI Mentor' : 'Open Waqfa AI Mentor'}
          title={isOpen ? 'Close Waqfa AI Mentor' : 'Chat with Waqfa AI Mentor'}
          className={`relative group w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md hover:scale-105 active:scale-95 ${
            isOpen
              ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-slate-900/20'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/25 ring-2 ring-emerald-500/20'
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <>
              <MessageCircle className="w-5 h-5 text-white" />
              {hasContext && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-teal-300 border-2 border-white rounded-full"
                  title="Context connected"
                />
              )}
            </>
          )}

          {/* Clean hover tooltip when closed */}
          {!isOpen && (
            <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm">
              Waqfa AI Mentor
            </span>
          )}
        </button>
      </div>

      {/* Floating Chat Panel Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Waqfa AI Mentor Chat Window"
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] h-[530px] max-h-[calc(100vh-6.5rem)] bg-white rounded-2xl shadow-xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          {/* Header with Soft Light-Green Tone */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-slate-50 border-b border-emerald-100/80 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-slate-900 font-['Space_Grotesk'] truncate">
                    Waqfa AI Mentor
                  </h3>
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
                    title="AI Mentor Ready"
                  />
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {roadmap
                    ? 'Roadmap Context Active'
                    : profile.targetField
                      ? 'Blueprint Connected'
                      : 'Pause, but with purpose.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Reset Conversation Button */}
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors cursor-pointer"
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors cursor-pointer"
                title="Close mentor panel"
                aria-label="Close mentor panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-[#FAFBFB]">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                      isUser
                        ? 'bg-slate-800 text-white'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-emerald-700 text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/80 whitespace-pre-line'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`text-[9px] block text-right mt-1.5 opacity-70 ${
                        isUser ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-3.5 py-2.5 flex items-center gap-1.5 text-slate-500 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] ml-1">Waqfa Mentor is thinking...</span>
                </div>
              </div>
            )}

            {/* Error Message if API fails */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="truncate">{errorMessage}</span>
                </div>
                <button
                  onClick={handleRetryLast}
                  className="text-rose-700 underline font-semibold shrink-0 cursor-pointer text-[11px]"
                >
                  Retry
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Starter Question Chips (shown early in conversation) */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-3 py-2 border-t border-slate-100 bg-white shrink-0">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Suggested questions:
              </span>
              <div className="flex flex-wrap gap-1">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200/70 text-left transition-colors truncate max-w-full cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Tab Jump Action (e.g. if student wants to update blueprint) */}
          {onNavigate && roadmap && (
            <div className="px-3 py-1.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
              <span>Want to update hours or goals?</span>
              <button
                onClick={() => {
                  onNavigate('blueprint');
                  setIsOpen(false);
                }}
                className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Edit Blueprint</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Footer Input Area */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your roadmap, exams, or next steps..."
                disabled={isLoading}
                maxLength={400}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white disabled:opacity-50"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-40 text-white flex items-center justify-center transition-colors shrink-0 shadow-xs cursor-pointer"
                title="Send message"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-1.5">
              Powered by Gemini AI • Contextual to your blueprint & roadmap
            </p>
          </div>
        </div>
      )}
    </>
  );
};
