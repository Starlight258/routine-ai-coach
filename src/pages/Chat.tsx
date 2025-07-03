
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WaveAnimation from '@/components/WaveAnimation';

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

  const predefinedQuestions = [
    "루틴을 계속 미루게 돼요",
    "동기 부여가 안 돼요",
    "시간 관리가 어려워요",
    "루틴을 바꾸고 싶어요"
  ];

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('미루') || lowerMessage.includes('계속')) {
      return "미루는 습관은 정말 많은 분들이 겪는 어려움이에요. 루틴을 작은 단위로 나누어보는 건 어떨까요? 예를 들어 '30분 책읽기' 대신 '책 1페이지 읽기'부터 시작해보세요. 성취감을 느끼면 자연스럽게 더 하게 될 거예요! 🌱";
    }
    
    if (lowerMessage.includes('동기') || lowerMessage.includes('의욕')) {
      return "동기부여가 떨어질 때는 처음 시작했던 이유를 떠올려보세요. 그리고 작은 성공을 축하하는 것도 중요해요! 매일 체크표에 ✅ 하나씩 쌓이는 것만으로도 충분히 대단한 일이에요. 💪";
    }
    
    if (lowerMessage.includes('시간') || lowerMessage.includes('바쁘')) {
      return "바쁜 일상에서 시간 내기 정말 어렵죠. 루틴을 기존 습관에 '끼워넣기'를 해보세요. 예를 들어 양치질 후 1분 스트레칭, 지하철에서 독서 등이요. 시간을 새로 만들기보다는 기존 시간을 활용하는 거예요! ⏰";
    }
    
    if (lowerMessage.includes('바꾸') || lowerMessage.includes('수정')) {
      return "루틴을 조정하고 싶으시는군요! 현재 어떤 부분이 가장 어려우신가요? 시간대, 난이도, 아니면 내용 자체인가요? 구체적으로 말씀해주시면 더 정확한 조언을 드릴 수 있어요. 🔧";
    }
    
    return "말씀해주신 내용을 잘 들었어요. 루틴은 완벽하지 않아도 괜찮아요. 중요한 건 꾸준히 시도하는 것 자체예요. 더 구체적인 상황을 알려주시면 맞춤형 조언을 드릴 수 있어요! 😊";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: getAIResponse(inputValue),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 relative overflow-hidden flex flex-col">
      <WaveAnimation />
      
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
              <p className="text-xs text-gray-600">언제든지 대화해보세요!</p>
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
              <p className="text-sm leading-relaxed">{message.text}</p>
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
      {messages.length <= 1 && (
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
            placeholder="루틴에 대해 무엇이든 물어보세요..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 bg-white/70"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
