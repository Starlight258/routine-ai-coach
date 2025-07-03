
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, BarChart3, Settings, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RoutineCard from '@/components/RoutineCard';
import WaveAnimation from '@/components/WaveAnimation';

const mockRoutines = [
  {
    id: 1,
    name: '책 읽기',
    color: '#FF6B8A',
    timeSlot: '오전',
    successCriteria: '30분 이상',
    status: 'success', // success, failed, pending
    completedToday: true,
    streak: 5,
    weekdays: ['월', '화', '수', '목', '금']
  },
  {
    id: 2,
    name: '운동하기',
    color: '#4ECDC4',
    timeSlot: '오후',
    successCriteria: '1시간 이상',
    status: 'pending',
    completedToday: false,
    streak: 3,
    weekdays: ['월', '수', '금']
  },
  {
    id: 3,
    name: '일기 쓰기',
    color: '#45B7D1',
    timeSlot: '밤',
    successCriteria: '10분 이상',
    status: 'failed',
    completedToday: false,
    streak: 0,
    weekdays: ['매일']
  }
];

const Dashboard = () => {
  const [routines, setRoutines] = useState(mockRoutines);

  const handleToggleRoutine = (id: number) => {
    setRoutines(prev => 
      prev.map(routine => 
        routine.id === id 
          ? { ...routine, completedToday: !routine.completedToday }
          : routine
      )
    );
  };

  const completedCount = routines.filter(r => r.completedToday).length;
  const totalCount = routines.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 relative overflow-hidden">
      {/* Wave Animation Background */}
      <WaveAnimation />
      
      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">오늘의 루틴들 🏄‍♀️</h1>
            <p className="text-gray-600">
              {completedCount}/{totalCount} 완료 • 오늘도 파도를 타보자!
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/stats">
              <Button variant="ghost" size="icon" className="rounded-full bg-white/50">
                <BarChart3 className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="ghost" size="icon" className="rounded-full bg-white/50">
                <MessageCircle className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/60 rounded-full h-3 mb-8 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-teal-400 transition-all duration-300 rounded-full"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Routine Cards */}
      <div className="relative z-10 px-6 space-y-4 pb-24">
        {routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            onToggle={() => handleToggleRoutine(routine.id)}
          />
        ))}
      </div>

      {/* Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200/50 px-6 py-4">
        <div className="flex justify-around items-center">
          <Button variant="ghost" size="sm" className="flex flex-col gap-1">
            <Calendar className="h-5 w-5" />
            <span className="text-xs">달력</span>
          </Button>
          
          <Link to="/create">
            <Button className="bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 rounded-full h-14 w-14 shadow-lg">
              <Plus className="h-6 w-6" />
            </Button>
          </Link>
          
          <Button variant="ghost" size="sm" className="flex flex-col gap-1">
            <Settings className="h-5 w-5" />
            <span className="text-xs">설정</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
