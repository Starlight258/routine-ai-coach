import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Heart, Save, BarChart3, MessageCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import WaveAnimation from '@/components/WaveAnimation';
import { toast } from 'sonner';

const mockRoutine = {
  id: 1,
  name: '책 읽기',
  color: '#FF6B8A',
  timeSlot: '오전',
  successCriteria: '30분 이상',
  motivation: '독서를 통해 지식을 넓히고 싶어서',
  weekdays: ['월', '화', '수', '목', '금']
};

const moodEmojis = [
  { emoji: '🙂', label: '좋아요', value: 'good' },
  { emoji: '😐', label: '보통', value: 'neutral' },
  { emoji: '🙁', label: '아쉬워요', value: 'bad' }
];

const RoutineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [mood, setMood] = useState('');
  const [reflection, setReflection] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI 분석 함수
  const analyzeReflection = (reflectionText: string, userMood: string, completed: boolean) => {
    setIsAnalyzing(true);
    
    // 키워드 기반 분석
    const lowerText = reflectionText.toLowerCase();
    const negativeKeywords = ['힘들', '어려', '피곤', '바쁘', '시간없', '못하겠', '포기', '스트레스', '귀찮'];
    const positiveKeywords = ['좋', '재밌', '뿌듯', '성취', '만족', '즐거', '행복'];
    
    const hasNegative = negativeKeywords.some(keyword => lowerText.includes(keyword));
    const hasPositive = positiveKeywords.some(keyword => lowerText.includes(keyword));

    setTimeout(() => {
      let response = '';
      
      if (completed && hasPositive) {
        // 성공 + 긍정적 소감
        response = `정말 멋져요! 🎉 "${reflectionText}"라고 하시니 정말 뿌듯하시겠어요. 이런 긍정적인 경험이 쌓여서 루틴이 더욱 자연스러워질 거예요. 내일도 화이팅!`;
      } else if (completed && hasNegative) {
        // 성공했지만 힘들었던 경우
        response = `힘든 상황에서도 해내신 것이 정말 대단해요! 💪 "${reflectionText}"라고 하시니, 조금 더 편하게 할 수 있는 방법을 찾아보면 어떨까요?\n\n💡 **대체 루틴 제안:**\n• 시간을 30분 → 15분으로 줄여보기\n• 시간대를 ${mockRoutine.timeSlot} → 더 여유로운 시간으로 변경\n• 목표를 "완벽히 하기"보다 "시작하기"로 낮춰보기`;
      } else if (!completed && hasNegative) {
        // 실패 + 부정적 소감
        response = `괜찮아요, 이런 날도 있는 거예요 🤗 "${reflectionText}"라고 하시니 정말 힘드셨겠어요. 루틴을 조금 조정해보면 어떨까요?\n\n💡 **맞춤 루틴 제안:**\n• **미니 루틴**: ${mockRoutine.name}을 5분만 해보기\n• **시간 변경**: 더 에너지가 있는 시간대로 이동\n• **대체 활동**: 오디오북 듣기, 짧은 글 읽기 등\n• **환경 개선**: 더 편한 장소에서 시도해보기`;
      } else if (!completed && !hasNegative) {
        // 실패했지만 담담한 경우
        response = `실패도 성장의 과정이에요 🌱 내일은 다시 도전해보시면 돼요! 혹시 루틴을 더 쉽게 만들어볼까요?\n\n💡 **쉬운 시작 제안:**\n• 목표 시간을 절반으로 줄이기\n• 매일 → 격일로 빈도 조정\n• 완벽한 실행보다 "시작"에 집중하기`;
      } else {
        // 기본 격려 메시지
        response = completed 
          ? `오늘도 루틴을 지키셨네요! 🎯 꾸준함이 바로 성공의 열쇠입니다. 내일도 화이팅!`
          : `괜찮아요! 내일은 새로운 기회예요 🌅 작은 것부터 다시 시작해보면 돼요.`;
      }

      setAiResponse(response);
      setIsAnalyzing(false);
    }, 1500);
  };

  // 자동 저장 함수
  const autoSave = () => {
    if (isCompleted !== null || mood || reflection) {
      localStorage.setItem(`routine_${id}_check`, JSON.stringify({
        completed: isCompleted,
        mood,
        reflection,
        date: new Date().toDateString()
      }));
      setHasUnsavedChanges(false);
      toast.success('자동으로 저장되었습니다!');
    }
  };

  // 데이터가 변경될 때마다 자동 저장 (1초 후)
  useEffect(() => {
    if (hasUnsavedChanges) {
      const timer = setTimeout(() => {
        autoSave();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasUnsavedChanges, isCompleted, mood, reflection]);

  // 소감이 변경되고 충분한 내용이 있을 때 AI 분석 실행
  useEffect(() => {
    if (reflection.length > 5 && mood && isCompleted !== null) {
      const timer = setTimeout(() => {
        analyzeReflection(reflection, mood, isCompleted);
      }, 2000); // 2초 후 분석 시작
      return () => clearTimeout(timer);
    }
  }, [reflection, mood, isCompleted]);

  // 컴포넌트 마운트 시 저장된 데이터 불러오기
  useEffect(() => {
    const savedData = localStorage.getItem(`routine_${id}_check`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.date === new Date().toDateString()) {
        setIsCompleted(parsed.completed);
        setMood(parsed.mood);
        setReflection(parsed.reflection);
      }
    }
  }, [id]);

  const handleComplete = (completed: boolean) => {
    setIsCompleted(completed);
    setHasUnsavedChanges(true);
  };

  const handleMoodChange = (selectedMood: string) => {
    setMood(selectedMood);
    setHasUnsavedChanges(true);
  };

  const handleReflectionChange = (value: string) => {
    setReflection(value);
    setHasUnsavedChanges(true);
    // 기존 AI 응답 초기화
    if (aiResponse) {
      setAiResponse('');
    }
  };

  const handleManualSave = () => {
    autoSave();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 relative overflow-hidden">
      <WaveAnimation />
      
      <div className="relative z-10 px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full bg-white/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: mockRoutine.color }}
            />
            <h1 className="text-2xl font-bold text-gray-800">{mockRoutine.name}</h1>
          </div>
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 text-orange-600 text-sm">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              저장 중...
            </div>
          )}
        </div>

        {/* Routine Info */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-600">목표: {mockRoutine.successCriteria}</p>
              <p className="text-gray-600">시간: {mockRoutine.timeSlot}</p>
            </div>
            <div className="flex gap-1">
              {mockRoutine.weekdays.map((day, index) => (
                <span 
                  key={index}
                  className="text-xs bg-white/60 px-2 py-1 rounded-full text-gray-600"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
          
          {mockRoutine.motivation && (
            <div className="bg-orange-50/50 p-4 rounded-xl">
              <p className="text-sm text-gray-700">
                <Heart className="inline h-4 w-4 mr-1 text-orange-400" />
                초심: {mockRoutine.motivation}
              </p>
            </div>
          )}
        </div>

        {/* Today's Check */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">오늘의 체크 📅</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSave}
              disabled={!hasUnsavedChanges}
              className="text-xs"
            >
              <Save className="h-3 w-3 mr-1" />
              저장
            </Button>
          </div>
          
          {/* Completion Buttons */}
          <div className="flex gap-4 mb-6">
            <Button
              variant={isCompleted ? 'default' : 'outline'}
              onClick={() => handleComplete(true)}
              className="flex-1 h-12 text-lg"
              style={{ 
                backgroundColor: isCompleted ? '#10B981' : 'transparent',
                borderColor: '#10B981'
              }}
            >
              <Check className="h-5 w-5 mr-2" />
              완료했어요
            </Button>
            <Button
              variant={isCompleted === false ? 'default' : 'outline'}
              onClick={() => handleComplete(false)}
              className="flex-1 h-12 text-lg"
              style={{ 
                backgroundColor: isCompleted === false ? '#EF4444' : 'transparent',
                borderColor: '#EF4444'
              }}
            >
              <X className="h-5 w-5 mr-2" />
              못했어요
            </Button>
          </div>

          {/* Mood Selection */}
          <div className="mb-4">
            <p className="text-gray-700 font-medium mb-3">오늘 기분은 어떠셨나요?</p>
            <div className="flex gap-4 justify-center">
              {moodEmojis.map((moodOption) => (
                <button
                  key={moodOption.value}
                  onClick={() => handleMoodChange(moodOption.value)}
                  className={`p-4 rounded-xl transition-all ${
                    mood === moodOption.value 
                      ? 'bg-blue-100 ring-2 ring-blue-400' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                >
                  <div className="text-3xl mb-1">{moodOption.emoji}</div>
                  <div className="text-xs text-gray-600">{moodOption.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Reflection */}
          <div className="mb-4">
            <p className="text-gray-700 font-medium mb-2">간단한 소감이나 어려웠던 점이 있다면?</p>
            <Textarea
              placeholder="예: 피곤해서 힘들었지만 그래도 해냈어요! / 시간이 부족해서 못했어요 (AI가 분석해서 조언해드려요)"
              value={reflection}
              onChange={(e) => handleReflectionChange(e.target.value)}
              className="bg-white/70"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              소감을 적으시면 AI가 분석해서 격려나 대체 루틴을 추천해드려요! ✨
            </p>
          </div>

          {/* AI Analysis Loading */}
          {isAnalyzing && (
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-xl border border-blue-200 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-white animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">AI가 분석 중...</p>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Response */}
          {aiResponse && !isAnalyzing && (
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 mb-1">AI 루틴 코치</p>
                  <div className="text-gray-700 whitespace-pre-line">{aiResponse}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate('/stats')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            통계 보기
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate('/chat')}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            AI 상담
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoutineDetail;