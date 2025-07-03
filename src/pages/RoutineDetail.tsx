import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Heart, Save, BarChart3, MessageCircle, Lightbulb, Clock, Zap, Coffee, Calendar as CalendarIcon } from 'lucide-react';
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

const failureReasons = [
  { 
    id: 'time', 
    label: '시간이 부족해서', 
    icon: Clock, 
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    suggestion: '시간 단축 루틴'
  },
  { 
    id: 'energy', 
    label: '에너지가 없어서', 
    icon: Zap, 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    suggestion: '가벼운 루틴'
  },
  { 
    id: 'tired', 
    label: '너무 피곤해서', 
    icon: Coffee, 
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    suggestion: '시간대 변경'
  },
  { 
    id: 'schedule', 
    label: '일정이 바껴서', 
    icon: CalendarIcon, 
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    suggestion: '유연한 루틴'
  }
];

const RoutineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [mood, setMood] = useState('');
  const [reflection, setReflection] = useState('');
  const [failureReason, setFailureReason] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI 분석 함수 - 실패 이유별 맞춤 응답
  const analyzeWithReason = (reason: string, reflectionText: string, userMood: string) => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      let response = '';
      
      switch (reason) {
        case 'time':
          response = `시간이 부족하셨군요! ⏰ 바쁜 일상 속에서도 루틴을 지키려는 마음이 소중해요.

💡 **시간 단축 루틴 제안:**
• **5분 미니 루틴**: ${mockRoutine.name}을 5분만 해보기
• **틈새 시간 활용**: 이동 중이나 대기 시간에 오디오북 듣기
• **목표 조정**: 30분 → 10-15분으로 현실적으로 설정
• **주말 집중**: 평일은 짧게, 주말에 조금 더 길게

작은 시작이 큰 변화를 만들어요! 🌱`;
          break;
          
        case 'energy':
          response = `에너지가 부족하셨군요! 💪 몸과 마음이 지쳤을 때는 무리하지 않는 것도 지혜예요.

💡 **가벼운 루틴 제안:**
• **앉아서 하기**: 침대나 소파에서 편하게 시작
• **오디오 활용**: 눈을 감고 오디오북이나 팟캐스트 듣기
• **5분 규칙**: 5분만 하고 그만둬도 OK
• **에너지 충전**: 충분한 휴식 후 다시 도전

완벽하지 않아도 괜찮아요! 🤗`;
          break;
          
        case 'tired':
          response = `너무 피곤하셨군요! 😴 충분한 휴식도 성공적인 루틴의 일부예요.

💡 **시간대 변경 제안:**
• **아침형으로**: 에너지가 가장 높은 아침 시간 활용
• **점심 후**: 식후 잠깐의 여유 시간 이용
• **주말 집중**: 평일은 쉬고 주말에 몰아서
• **수면 우선**: 충분한 잠을 자고 컨디션 회복

건강한 몸이 지속 가능한 루틴의 기초예요! 💤`;
          break;
          
        case 'schedule':
          response = `일정이 바뀌셨군요! 📅 예상치 못한 변화는 누구에게나 있어요.

💡 **유연한 루틴 제안:**
• **시간 자유화**: 정해진 시간 대신 "하루 중 언제든"으로 설정
• **대체 활동**: 외출 시에는 오디오북, 집에서는 종이책
• **주 단위 목표**: 매일 대신 "주 3회" 같은 유연한 목표
• **백업 플랜**: 바쁜 날을 위한 5분 버전 준비

변화에 적응하는 것도 성장이에요! 🌊`;
          break;
          
        default:
          response = `괜찮아요! 실패도 성장의 과정이에요 🌱 내일은 새로운 기회입니다.`;
      }

      // 소감이 있다면 추가 분석
      if (reflectionText.length > 5) {
        const lowerText = reflectionText.toLowerCase();
        if (lowerText.includes('포기') || lowerText.includes('그만')) {
          response += `\n\n💙 **포기하고 싶은 마음이 드시는군요.** 그런 마음도 자연스러워요. 잠시 쉬어가도 괜찮고, 더 작은 목표로 다시 시작해도 좋아요. 당신의 속도로 가면 돼요!`;
        } else if (lowerText.includes('스트레스') || lowerText.includes('부담')) {
          response += `\n\n🤗 **스트레스를 받고 계시는군요.** 루틴이 부담이 되면 안 되죠. 목표를 더 낮춰서 부담 없이 할 수 있는 수준으로 조정해보세요. 루틴은 나를 괴롭히는 게 아니라 도와주는 거예요!`;
        }
      }

      setAiResponse(response);
      setIsAnalyzing(false);
    }, 1500);
  };

  // 일반 소감 분석 함수 (성공했을 때)
  const analyzeReflection = (reflectionText: string, userMood: string) => {
    setIsAnalyzing(true);
    
    const lowerText = reflectionText.toLowerCase();
    const negativeKeywords = ['힘들', '어려', '피곤', '바쁘', '시간없', '못하겠', '포기', '스트레스', '귀찮'];
    const positiveKeywords = ['좋', '재밌', '뿌듯', '성취', '만족', '즐거', '행복'];
    
    const hasNegative = negativeKeywords.some(keyword => lowerText.includes(keyword));
    const hasPositive = positiveKeywords.some(keyword => lowerText.includes(keyword));

    setTimeout(() => {
      let response = '';
      
      if (hasPositive) {
        response = `정말 멋져요! 🎉 "${reflectionText}"라고 하시니 정말 뿌듯하시겠어요. 이런 긍정적인 경험이 쌓여서 루틴이 더욱 자연스러워질 거예요. 내일도 화이팅!`;
      } else if (hasNegative) {
        response = `힘든 상황에서도 해내신 것이 정말 대단해요! 💪 "${reflectionText}"라고 하시니, 조금 더 편하게 할 수 있는 방법을 찾아보면 어떨까요?

💡 **더 쉬운 방법 제안:**
• 시간을 30분 → 15분으로 줄여보기
• 시간대를 ${mockRoutine.timeSlot} → 더 여유로운 시간으로 변경
• 목표를 "완벽히 하기"보다 "시작하기"로 낮춰보기`;
      } else {
        response = `오늘도 루틴을 지키셨네요! 🎯 꾸준함이 바로 성공의 열쇠입니다. 내일도 화이팅!`;
      }

      setAiResponse(response);
      setIsAnalyzing(false);
    }, 1500);
  };

  // 자동 저장 함수
  const autoSave = () => {
    if (isCompleted !== null || mood || reflection || failureReason) {
      localStorage.setItem(`routine_${id}_check`, JSON.stringify({
        completed: isCompleted,
        mood,
        reflection,
        failureReason,
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
  }, [hasUnsavedChanges, isCompleted, mood, reflection, failureReason]);

  // AI 분석 트리거
  useEffect(() => {
    if (isCompleted === false && failureReason && mood) {
      // 실패 + 이유 선택 시 즉시 분석
      analyzeWithReason(failureReason, reflection, mood);
    } else if (isCompleted === true && reflection.length > 5 && mood) {
      // 성공 + 소감 작성 시 2초 후 분석
      const timer = setTimeout(() => {
        analyzeReflection(reflection, mood);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCompleted, failureReason, reflection, mood]);

  // 컴포넌트 마운트 시 저장된 데이터 불러오기
  useEffect(() => {
    const savedData = localStorage.getItem(`routine_${id}_check`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.date === new Date().toDateString()) {
        setIsCompleted(parsed.completed);
        setMood(parsed.mood);
        setReflection(parsed.reflection);
        setFailureReason(parsed.failureReason || '');
      }
    }
  }, [id]);

  const handleComplete = (completed: boolean) => {
    setIsCompleted(completed);
    setHasUnsavedChanges(true);
    // 상태 변경 시 기존 응답 초기화
    setAiResponse('');
    if (completed) {
      setFailureReason(''); // 성공 시 실패 이유 초기화
    }
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

  const handleFailureReasonSelect = (reason: string) => {
    setFailureReason(reason);
    setHasUnsavedChanges(true);
    // 기존 AI 응답 초기화
    setAiResponse('');
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

          {/* Failure Reason Selection (only when failed) */}
          {isCompleted === false && (
            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-3">어떤 이유로 못하셨나요? (AI가 맞춤 조언을 드려요)</p>
              <div className="grid grid-cols-2 gap-3">
                {failureReasons.map((reason) => {
                  const IconComponent = reason.icon;
                  return (
                    <button
                      key={reason.id}
                      onClick={() => handleFailureReasonSelect(reason.id)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        failureReason === reason.id 
                          ? reason.color + ' ring-2 ring-offset-2 ring-blue-400' 
                          : 'bg-white/50 border-gray-200 hover:bg-white/70'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm font-medium">{reason.label}</span>
                      </div>
                      <div className="text-xs opacity-75">{reason.suggestion}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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

          {/* Reflection (only for success or additional thoughts) */}
          {isCompleted !== false && (
            <div className="mb-4">
              <p className="text-gray-700 font-medium mb-2">간단한 소감이나 어려웠던 점이 있다면?</p>
              <Textarea
                placeholder="예: 피곤해서 힘들었지만 그래도 해냈어요! (AI가 분석해서 조언해드려요)"
                value={reflection}
                onChange={(e) => handleReflectionChange(e.target.value)}
                className="bg-white/70"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                소감을 적으시면 AI가 분석해서 격려해드려요! ✨
              </p>
            </div>
          )}

          {/* Additional thoughts for failed routines */}
          {isCompleted === false && (
            <div className="mb-4">
              <p className="text-gray-700 font-medium mb-2">추가로 하고 싶은 말이 있다면?</p>
              <Textarea
                placeholder="예: 요즘 너무 바빠서 스트레스가 많아요..."
                value={reflection}
                onChange={(e) => handleReflectionChange(e.target.value)}
                className="bg-white/70"
                rows={2}
              />
            </div>
          )}

          {/* AI Analysis Loading */}
          {isAnalyzing && (
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-xl border border-blue-200 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-white animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">AI가 맞춤 조언을 준비 중...</p>
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
                  <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">{aiResponse}</div>
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