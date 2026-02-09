import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Send, Bot, User, Loader2 } from 'lucide-react';
import { aiApi } from '@/integrations/ai/ai-api';
import { speechEngine } from '@/integrations/ai/speech-engine';
import { contextProvider } from '@/integrations/ai/context-provider';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function VoiceChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMicrophoneSupported, setIsMicrophoneSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN'; // Indian English accent
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          handleSubmit(transcript);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };
        
        recognitionRef.current = recognition;
      } else {
        setIsMicrophoneSupported(false);
      }
    } else {
      setIsMicrophoneSupported(false);
    }

    // Add welcome message
    setMessages([
      {
        id: 'welcome',
        text: 'Hello! I\'m your RAHI assistant. How can I help you today?',
        sender: 'ai',
        timestamp: new Date(),
      }
    ]);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = async (text: string) => {
    if (!text) return;
    
    setIsSpeaking(true);
    try {
      await speechEngine.speak(text, {
        voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel voice
        stability: 0.75,
        similarityBoost: 0.9
      });
    } catch (error) {
      console.error('Error in speech synthesis:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleSubmit = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Get context for the AI
      const context = await contextProvider.getChatContext();
      
      // Get AI response
      const aiResponse = await aiApi.sendMessage(messageText, context);
      
      // Add AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the AI response
      await speakText(aiResponse);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Could you please try again?',
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      await speakText('Sorry, I encountered an error. Could you please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto p-4">
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            RAHI Voice Assistant
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              {speechEngine.isVoiceEnabled() ? (
                <>
                  <Volume2 className="h-3 w-3 text-green-500" />
                  Voice Enabled
                </>
              ) : (
                <>
                  <VolumeX className="h-3 w-3 text-red-500" />
                  Voice Disabled
                </>
              )}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {isMicrophoneSupported ? (
                <>
                  <Mic className={`h-3 w-3 ${isListening ? 'text-red-500' : 'text-green-500'}`} />
                  {isListening ? 'Listening...' : 'Ready'}
                </>
              ) : (
                <>
                  <MicOff className="h-3 w-3 text-red-500" />
                  Microphone Unavailable
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col gap-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'ai' && (
                        <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="whitespace-pre-wrap">{message.text}</span>
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        message.sender === 'user'
                          ? 'text-primary-foreground/70'
                          : 'text-secondary-foreground/70'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-secondary-foreground max-w-xs px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 mt-0.5" />
                      <span>Thinking...</span>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={conversationEndRef} />
            </div>
          </ScrollArea>
          
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message or click the mic to speak..."
              disabled={isLoading || isListening}
              className="flex-1"
            />
            <Button
              onClick={() => handleSubmit()}
              disabled={!inputText.trim() || isLoading || isListening}
              variant="outline"
            >
              <Send className="h-4 w-4" />
            </Button>
            {isMicrophoneSupported && (
              <Button
                onClick={isListening ? stopListening : startListening}
                disabled={isLoading}
                variant={isListening ? "destructive" : "secondary"}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground text-center">
            {isMicrophoneSupported
              ? "Click the microphone to speak to the assistant"
              : "Microphone not supported in this browser"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}