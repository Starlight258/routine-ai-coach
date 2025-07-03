
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WaveAnimation from '@/components/WaveAnimation';
import ApiKeySetup from '@/components/ApiKeySetup';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "안녕하세요! 저는 당신의 루틴 AI 코치입니다 🏄‍♀️ 루틴에 대해 궁금한 것이 있으시거나, 힘든 점이 있다면 언제든지 말씀해주세요!",
    isUser: false,
    timestamp: new Date()
  }
];

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);

  const predefinedQuestions = [
    "루틴을 계속 미루게 돼요",
    "동기 부여가 안 돼요",
    "시간 관리가 어려워요",
    "루틴을 바꾸고 싶어요"
  ];

  useEffect(() => {
    const storedApiKey = localStorage.getItem('gemini_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setShowApiKeySetup(true);
    }
  }, []);

  const callGeminiAPI = async (userMessage: string): Promise<string> => {
    if (!apiKey) {
      return "API 키가 설정되지 않았습니다.";
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `당신은 친근하고 공감적인 루틴 코치입니다. 사용자의 루틴 관리를 도와주세요. 
              
사용자 메시지: ${userMessage}

한국어로 따뜻하고 격려하는 톤으로 답변해주세요. 구체적이고 실용적인 조언을 포함해주세요.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('API 응답 형식이 예상과 다릅니다.');
      }
    } catch (error) {
      console.error('Gemini API 호출 중 오류:', error);
      return "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !apiKey) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const aiResponse = await callGeminiAPI(inputValue);
      
      const aiMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('메시지 전송 중 오류:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleApiKeySet = (newApiKey: string) => {
    setApiKey(newApiKey);
    setShowApiKeySetup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 relative overflow-hidden flex flex-col">
      <WaveAnimation />
      
      <ApiKeySetup 
        isOpen={showApiKeySetup} 
        onApiKeySet={handleApiKeySet}
      />
      
      {/* Header */}
      <div className="relative z-10 px-6 py-4 bg-white/60 backdrop-blur-sm border-b border-gray-200/50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🤖</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">AI 루틴 코치</h1>
              <p className="text-xs text-gray-600">
                {apiKey ? '언제든지 대화해보세요!' : 'API 키를 설정해주세요'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 relative z-10 px-6 py-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                message.isUser
                  ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                  : 'bg-white/80 backdrop-blur-sm text-gray-800'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
              <p className={`text-xs mt-2 ${
                message.isUser ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString('ko-KR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      {messages.length <= 1 && apiKey && (
        <div className="relative z-10 px-6 py-2">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-gray-600">빠른 질문</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {predefinedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickQuestion(question)}
                className="text-xs bg-white/50 hover:bg-white/70"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="relative z-10 px-6 py-4 bg-white/60 backdrop-blur-sm border-t border-gray-200/50">
        <div className="flex gap-3">
          <Input
            placeholder={apiKey ? "루틴에 대해 무엇이든 물어보세요..." : "먼저 API 키를 설정해주세요"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-white/70"
            disabled={!apiKey}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping || !apiKey}
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {!apiKey && (
          <div className="mt-2 text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApiKeySetup(true)}
              className="text-xs"
            >
              API 키 설정하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
