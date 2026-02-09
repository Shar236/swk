import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, MessageSquare, Send, Volume2, VolumeX, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate, useLocation } from 'react-router-dom';
import { KNOWLEDGE_BASE } from '@/data/knowledge';
import { speechEngine } from '@/integrations/ai/speech-engine';
import { aiApi } from '@/integrations/ai/ai-api';
import { contextProvider } from '@/integrations/ai/context-provider';

// --- TYPES ---
interface Message {
  role: 'user' | 'assistant';
  content: string;
  isVoice?: boolean;
}

// --- COMPONENT ---
export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Namaste! I am your RAHI Assistant. How can I help you navigate our platform today?" }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [muteVoice, setMuteVoice] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Get AI response using the proper AI API
      const context = await contextProvider.getChatContext();
      const aiResponse = await aiApi.sendMessage(text, context);
      
      // Check if the response contains navigation instructions
      const q = text.toLowerCase();
      let navigateTo: string | undefined;
      
      if (q.includes('book') || q.includes('hire') || q.includes('booking')) {
        navigateTo = '/services';
      } else if (q.includes('track') || q.includes('status') || q.includes('where is my worker')) {
        navigateTo = '/tracking';
      } else if (q.includes('login') || q.includes('register') || q.includes('sign up')) {
        navigateTo = '/login';
      } else if (q.includes('home') || q.includes('main page')) {
        navigateTo = '/';
      }

      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      
      if (navigateTo) {
        navigate(navigateTo);
      }

      if (!muteVoice) {
        speak(aiResponse);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMsg: Message = { 
        role: 'assistant', 
        content: "I'm having trouble connecting to the AI service. Let me fall back to basic responses." 
      };
      setMessages(prev => [...prev, errorMsg]);
      
      // Fallback to original logic
      const response = await processFallbackQuery(text);
      setMessages(prev => [...prev, { role: 'assistant', content: response.text }]);
      
      if (response.navigate) {
        navigate(response.navigate);
      }

      if (!muteVoice) {
        speak(response.text);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Fallback Brain Logic ---
  const processFallbackQuery = async (query: string): Promise<{ text: string; navigate?: string }> => {
    const q = query.toLowerCase();
    
    // 1. Navigation Shortcuts
    if (q.includes('book') || q.includes('hire') || q.includes('booking')) {
      return { 
        text: "I can help you with that! Taking you to our booking section where you can choose a professional for your needs.",
        navigate: '/services'
      };
    }
    
    if (q.includes('track') || q.includes('status') || q.includes('where is my worker')) {
      return {
        text: "Sure! Let's check your active bookings in the tracking section.",
        navigate: '/tracking'
      };
    }

    if (q.includes('login') || q.includes('register') || q.includes('sign up')) {
      return {
        text: "Heading to the registration page. You can join as a Worker, Customer, or Partner!",
        navigate: '/login'
      };
    }

    if (q.includes('home') || q.includes('main page')) {
      return {
        text: "Returning you to the homepage.",
        navigate: '/'
      };
    }

    // 2. Knowledge Base Search (Keyword Scoring)
    const keywords = q.split(' ').filter(word => word.length > 3);
    let bestMatch = { content: '', score: 0 };

    KNOWLEDGE_BASE.forEach(doc => {
      let score = 0;
      keywords.forEach(kw => {
        if (doc.content.toLowerCase().includes(kw)) score++;
      });
      if (score > bestMatch.score) {
        bestMatch = { content: doc.content, score };
      }
    });

    if (bestMatch.score > 0) {
      // Extract a relevant sentence/paragraph
      const sentences = bestMatch.content.split(/[.!?]/);
      const relevant = sentences.find(s => keywords.some(kw => s.toLowerCase().includes(kw))) || sentences[0];
      return { text: relevant.trim() + "." };
    }

    // 3. Fallback based on general knowledge of RAHI (from PDF context)
    if (q.includes('commission') || q.includes('price') || q.includes('charge')) {
      return { text: "RAHI uses a fair pricing model with only 8-12% commission, which is much lower than other platforms. We believe in dignity and fair earnings for our workers." };
    }
    
    if (q.includes('urban company') || q.includes('competitor')) {
      return { text: "Unlike Urban Company, RAHI focuses on Tier-2 and Tier-3 cities, offers faster 60-second matching, and doesn't penalize workers for rejecting jobs. We're an ethical gig platform." };
    }

    if (q.includes('voice') || q.includes('literacy')) {
      return { text: "We specialized our app for low-literacy users with voice navigation in regional languages like Hindi, Bengali, and Marathi." };
    }

    return { 
      text: "I'm not quite sure about that. But I can help you book a service, track a professional, or tell you about our mission to empower workers. What would you like to do?"
    };
  };

  // --- TTS (Using SpeechEngine) ---
  const speak = async (text: string) => {
    if (muteVoice || !text) return;
    setIsSpeaking(true);
    
    try {
      await speechEngine.speak(text, {
        voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel voice
        stability: 0.75,
        similarityBoost: 0.9
      });
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  // --- STT (Web Speech API) ---
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;  // Single utterance only
    recognition.interimResults = false;  // Only final results
    
    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSend(transcript);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.start();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-[350px] md:w-[400px]"
          >
            <Card className="flex flex-col h-[500px] shadow-2xl border-primary/20 overflow-hidden glassmorphism">
              {/* Header */}
              <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center bg-gradient-to-r from-orange-500 via-white to-green-600">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="font-bold text-slate-900">RAHI Guide</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-900 hover:bg-black/10" onClick={() => setMuteVoice(!muteVoice)}>
                    {muteVoice ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-900 hover:bg-black/10" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Chat Area */}
              <ScrollArea className="flex-1 p-4 bg-slate-50/50" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                        m.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-none' 
                          : 'bg-white border text-slate-800 rounded-tl-none'
                      }`}>
                        {m.content}
                      </div>
                    </motion.div>
                  ))}
                  {(isSpeaking || isLoading) && (
                    <div className="flex justify-start">
                      <div className="flex gap-1 items-center bg-white border p-2 rounded-full px-4 text-xs font-medium text-slate-500 italic">
                        {isSpeaking ? (
                          <>
                            <Volume2 className="w-3 h-3 animate-pulse text-primary" />
                            Speaking...
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-3 h-3 animate-pulse text-primary" />
                            Thinking...
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="p-4 bg-white border-t flex gap-2 items-center">
                <Button 
                  variant={isListening ? "destructive" : "outline"} 
                  size="icon" 
                  className={`rounded-full h-10 w-10 shrink-0 ${isListening ? 'animate-pulse' : ''}`}
                  onClick={startListening}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                  disabled={isLoading}
                />
                <Button 
                  size="icon" 
                  className="rounded-full h-10 w-10 shrink-0 bg-primary"
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                >
                  {isLoading ? <MessageSquare className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-primary shadow-lg flex items-center justify-center text-white ring-4 ring-primary/20 bg-gradient-to-br from-orange-500 to-green-600 transition-all"
      >
        <MessageSquare className="w-8 h-8" />
      </motion.button>
    </div>
  );
};