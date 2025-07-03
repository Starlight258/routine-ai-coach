
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, Flame, Target, Calendar, TrendingUp } from 'lucide-react';

interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  earnedDate?: string;
  category: 'streak' | 'milestone' | 'recovery' | 'special';
}

const mockBadges: UserBadge[] = [
  {
    id: 'first-routine',
    name: '첫 걸음',
    description: '첫 루틴을 생성했습니다',
    icon: <Target className="h-4 w-4" />,
    earned: true,
    earnedDate: '2025-01-01',
    category: 'milestone'
  },
  {
    id: 'streak-3',
    name: '꾸준함 🔥',
    description: '3일 연속 루틴을 성공했습니다',
    icon: <Flame className="h-4 w-4" />,
    earned: true,
    earnedDate: '2025-01-03',
    category: 'streak'
  },
  {
    id: 'first-reflection',
    name: '첫 회고 완료 ✍️',
    description: '첫 회고를 작성했습니다',
    icon: <Calendar className="h-4 w-4" />,
    earned: true,
    earnedDate: '2025-01-02',
    category: 'milestone'
  },
  {
    id: 'comeback-hero',
    name: '회복 루틴 클리어 💪',
    description: '실패 후 다시 루틴을 시작했습니다',
    icon: <TrendingUp className="h-4 w-4" />,
    earned: false,
    category: 'recovery'
  },
  {
    id: 'streak-7',
    name: '일주일 챔피언 🏆',
    description: '7일 연속 루틴을 성공했습니다',
    icon: <Award className="h-4 w-4" />,
    earned: false,
    category: 'streak'
  }
];

const BadgeSystem = () => {
  const earnedBadges = mockBadges.filter(badge => badge.earned);
  const unearned = mockBadges.filter(badge => !badge.earned);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'streak': return 'bg-gradient-to-r from-red-400 to-orange-400';
      case 'milestone': return 'bg-gradient-to-r from-blue-400 to-purple-400';
      case 'recovery': return 'bg-gradient-to-r from-green-400 to-teal-400';
      case 'special': return 'bg-gradient-to-r from-purple-400 to-pink-400';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Award className="h-6 w-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-800">나의 뱃지 🏅</h2>
      </div>

      {/* 획득한 뱃지 */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          획득한 뱃지 ({earnedBadges.length})
        </h3>
        
        {earnedBadges.length === 0 ? (
          <p className="text-gray-500 text-center py-8">아직 획득한 뱃지가 없습니다</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {earnedBadges.map(badge => (
              <div 
                key={badge.id}
                className={`p-4 rounded-xl text-white shadow-lg ${getCategoryColor(badge.category)}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/20 rounded-full">
                    {badge.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{badge.name}</h4>
                    <p className="text-sm opacity-90">{badge.description}</p>
                  </div>
                </div>
                {badge.earnedDate && (
                  <div className="text-xs opacity-75">
                    획득일: {new Date(badge.earnedDate).toLocaleDateString('ko-KR')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 다음 목표 뱃지 */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          다음 목표 🎯
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {unearned.slice(0, 4).map(badge => (
            <div 
              key={badge.id}
              className="p-4 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-200 rounded-full text-gray-500">
                  {badge.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-700">{badge.name}</h4>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                미획득
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* 뱃지 통계 */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">뱃지 통계</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <div className="text-2xl font-bold text-orange-500">{earnedBadges.length}</div>
            <div className="text-sm text-gray-600">획득 뱃지</div>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-500">{mockBadges.length}</div>
            <div className="text-sm text-gray-600">전체 뱃지</div>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <div className="text-2xl font-bold text-green-500">
              {Math.round((earnedBadges.length / mockBadges.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">달성률</div>
          </div>
          <div className="text-center p-3 bg-white/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-500">
              {earnedBadges.filter(b => b.category === 'streak').length}
            </div>
            <div className="text-sm text-gray-600">연속 뱃지</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeSystem;
