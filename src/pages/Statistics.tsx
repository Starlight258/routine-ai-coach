
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Award, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import WaveAnimation from '@/components/WaveAnimation';

const weeklyData = [
  { day: '월', success: 85 },
  { day: '화', success: 75 },
  { day: '수', success: 90 },
  { day: '목', success: 60 },
  { day: '금', success: 80 },
  { day: '토', success: 95 },
  { day: '일', success: 70 },
];

const failureReasons = [
  { name: '피로', value: 35, color: '#FF6B8A' },
  { name: '야근', value: 25, color: '#4ECDC4' },
  { name: '약속', value: 20, color: '#45B7D1' },
  { name: '기타', value: 20, color: '#96CEB4' },
];

const achievements = [
  { id: 1, name: '첫 걸음', description: '첫 루틴 생성', earned: true, icon: '🎯' },
  { id: 2, name: '꾸준함', description: '3일 연속 성공', earned: true, icon: '🔥' },
  { id: 3, name: '극복', description: '실패 후 재도전', earned: true, icon: '💪' },
  { id: 4, name: '주간 달성', description: '일주일 완주', earned: false, icon: '🏆' },
];

const Statistics = () => {
  const navigate = useNavigate();

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
          <h1 className="text-2xl font-bold text-gray-800">루틴 회고 📊</h1>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">이번 주 성공률</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">78%</div>
            <div className="text-xs text-green-600">+12% 향상</div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600">연속 기록</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">5일</div>
            <div className="text-xs text-blue-600">최고 기록</div>
          </div>
        </div>

        {/* Weekly Success Chart */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">주간 성공률</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Bar dataKey="success" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Failure Analysis */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">실패 원인 분석</h2>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={failureReasons}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                  >
                    {failureReasons.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {failureReasons.map((reason, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: reason.color }}
                  />
                  <span className="text-sm text-gray-700">{reason.name}</span>
                  <span className="text-sm text-gray-500">({reason.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg mb-6 border border-purple-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            🤖 AI 루틴 조정 제안
          </h2>
          <div className="space-y-3">
            <div className="bg-white/50 p-3 rounded-xl">
              <p className="text-sm text-gray-700">
                <strong>피로가 주요 원인이네요.</strong> 저녁 루틴을 오후로 옮기거나, 목표 시간을 20분으로 줄여보는 건 어떨까요?
              </p>
            </div>
            <div className="bg-white/50 p-3 rounded-xl">
              <p className="text-sm text-gray-700">
                <strong>주말 성공률이 높아요!</strong> 주말에 하는 방식을 평일에도 적용해보세요.
              </p>
            </div>
          </div>
          <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500">
            제안 적용하기
          </Button>
        </div>

        {/* Achievements */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            <Award className="inline h-5 w-5 mr-2 text-yellow-500" />
            달성한 뱃지
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-3 rounded-xl border-2 transition-all ${
                  achievement.earned 
                    ? 'bg-yellow-50 border-yellow-300' 
                    : 'bg-gray-50 border-gray-200 opacity-50'
                }`}
              >
                <div className="text-2xl mb-1">{achievement.icon}</div>
                <div className="text-sm font-medium text-gray-800">{achievement.name}</div>
                <div className="text-xs text-gray-600">{achievement.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
