
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Heart, Save } from 'lucide-react';
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

  // 자동 저장 함수
  const autoSave = () => {
    if (isCompleted !== null || mood || reflection) {
      // 여기서 실제로는 API 호출을 통해 서버에 저장
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
    
    // AI 응답 생성
    if (completed && mood && reflection) {
      setTimeout(() => {
        setAiResponse(
          mood === 'good' 
            ? "정말 잘하셨어요! 🎉 꾸준함이 바로 성공의 열쇠입니다. 내일도 화이팅!"
            : mood === 'neutral'
            ? "오늘도 루틴을 지키신 것만으로도 충분합니다! 💪 조금씩 개선해나가면 돼요."
            : "힘든 상황에서도 도전하신 것이 대단해요. 🌟 내일은 조금 더 수월할 거예요. 루틴 시간을 조정해볼까요?"
        );
      }, 500);
    }
  };

  const handleMoodChange = (selectedMood: string) => {
    setMood(selectedMood);
    setHasUnsavedChanges(true);
  };

  const handleReflectionChange = (value: string) => {
    setReflection(value);
    setHasUnsavedChanges(true);
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
              placeholder="예: 피곤해서 힘들었지만 그래도 해냈어요! (자동으로 저장됩니다)"
              value={reflection}
              onChange={(e) => handleReflectionChange(e.target.value)}
              className="bg-white/70"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              입력하신 내용은 1초 후 자동으로 저장됩니다.
            </p>
          </div>

          {/* AI Response */}
          {aiResponse && (
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 mb-1">AI 코치</p>
                  <p className="text-gray-700">{aiResponse}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            루틴 수정
          </Button>
          <Button variant="outline" className="flex-1">
            통계 보기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoutineDetail;
