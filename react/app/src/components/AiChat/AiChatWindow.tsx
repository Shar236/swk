import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, User, Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { aiApi, speechEngine, useChatContext } from '@/integrations/ai';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isSpeaking?: boolean;
}

export function AiChatWindow({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const listeningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user, profile } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();
  const { getChatContext } = useChatContext();

  useEffect(() => {
    if (isOpen) {
      // Load initial context and send welcome message
      loadInitialContext();
      textareaRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup function to clear timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
      }
    };
  }, []);

  const loadInitialContext = async () => {
    try {
      const context = await getChatContext();
      const welcomeMessage = "Hello! I'm RAHI's assistant. How can I help you today? You can ask me about our services, how to book a professional, or learn more about RAHI.";
      
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date(),
        isSpeaking: false
      }]);
      
      // Speak welcome message if voice is enabled
      if (isVoiceEnabled) {
        await speakMessage(welcomeMessage);
      }
    } catch (error) {
      console.error('Error loading initial context:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speakMessage = async (text: string) => {
    if (!speechEngine || !speechEngine.isVoiceEnabled()) {
      console.warn('Speech engine not available or voice not enabled');
      return;
    }
    
    try {
      setIsSpeaking(true);
      await speechEngine.speak(text);
    } catch (error) {
      console.error('Error speaking message:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');

    // Add user message to chat
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Get current context
      const context = await getChatContext();
      
      // Send message to AI
      const response = await aiApi.sendMessage(userMessage, context);
      
      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        isSpeaking: false
      };

      setMessages(prev => [...prev, aiMessage]);

      // Speak response if voice is enabled
      if (isVoiceEnabled) {
        speakMessage(response);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isSpeaking: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, isVoiceEnabled, speechEngine]);

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (isVoiceEnabled) {
      speechEngine.stopSpeaking();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false);
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current);
        listeningTimeoutRef.current = null;
      }
    } else {
      // Start actual speech recognition
      setIsListening(true);
      
      // Use Web Speech API for actual speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error("Speech Recognition not supported in this browser.");
        setIsListening(false);
        return;
      }
      
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
      
      // Set a timeout as backup to stop listening
      listeningTimeoutRef.current = setTimeout(() => {
        setIsListening(false);
        if (recognition) {
          recognition.stop();
        }
      }, 10000); // 10 second timeout
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md h-[80vh] max-h-[600px] bg-background border rounded-lg shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">RAHI Assistant</h3>
              <p className="text-xs text-muted-foreground">
                {isLoading ? 'Thinking...' : `Online (${aiApi.getApiProvider ? aiApi.getApiProvider().toUpperCase() : 'AI'})`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVoice}
              className={cn(
                isVoiceEnabled && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {isVoiceEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
            
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
                
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2",
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted rounded-bl-md'
                )}>
                  <p className="text-sm">{message.content}</p>
                  <p className={cn(
                    "text-xs mt-1",
                    message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}>
                    {formatTime(message.timestamp)}
                    {message.isSpeaking && ' (speaking)'}
                  </p>
                </div>
                
                {message.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-muted/30">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[44px] resize-none pr-12"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={toggleListening}
                disabled={isLoading}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-destructive" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <Button
              type="submit"
              size="icon"
              className="h-11 w-11"
              disabled={!inputValue.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}